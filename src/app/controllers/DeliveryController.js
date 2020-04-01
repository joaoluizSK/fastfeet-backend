import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliveryController {
  async store(req, res) {
    const paramsSchema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await paramsSchema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found!' });
    }

    const parsedDate = parseISO(new Date().toISOString());

    const deliveryAmountPerDay = await Order.count({
      where: {
        deliveryman_id: order.deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    if (deliveryAmountPerDay > 5) {
      return res
        .status(400)
        .json({ error: 'Maximum the deliveries achieved!' });
    }

    const updatedOrder = await order.update({
      startDate: new Date(),
    });

    return res.json(updatedOrder);
  }

  async update(req, res) {
    const paramsSchema = Yup.object().shape({
      id: Yup.number().required(),
    });

    const paramsBodySchema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await paramsSchema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    if (!(await paramsBodySchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found!' });
    }

    const updatedOrder = await order.update({
      endDate: new Date(),
      signature_id: req.body.signature_id,
    });

    return res.json(updatedOrder);
  }

  async index(req, res) {
    const paramsSchema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
    });

    const queryParamsSchema = Yup.object().shape({
      delivered: Yup.boolean().required(),
    });

    if (!(await paramsSchema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    if (!(await queryParamsSchema.isValid(req.query))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const { delivered } = req.query;

    const deliveryman = await Deliveryman.findByPk(req.params.deliveryman_id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found!' });
    }

    let orders = [];

    if (delivered === 'true') {
      orders = await Order.findAll({
        where: {
          deliveryman_id: req.params.deliveryman_id,
          end_date: { [Op.ne]: null },
        },
      });
    } else {
      orders = await Order.findAll({
        where: {
          deliveryman_id: req.params.deliveryman_id,
          canceled_at: null,
          end_date: null,
        },
      });
    }

    return res.json(orders);
  }
}

export default new DeliveryController();
