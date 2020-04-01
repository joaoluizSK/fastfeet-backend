import * as Yup from 'yup';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import OrderDetailsMail from '../jobs/OrderDetailsMail';
import Queue from '../../lib/Queue';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    // Verify Recipient
    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found!' });
    }

    // Verify Deliveryman
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found!' });
    }

    const { id, product } = await Order.create(req.body);

    await Queue.add(OrderDetailsMail.key, {
      deliveryman,
      recipient: recipient.name,
      fullAddress: recipient.fullAddress(),
      product,
    });

    return res.json({
      id,
      product,
      recipient_id,
      deliveryman_id,
    });
  }

  async index(req, res) {
    const orders = await Order.findAll();
    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    // Verify Recipient
    if (recipient_id) {
      const recipient = await Recipient.findByPk(recipient_id);

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found!' });
      }
    }
    if (deliveryman_id) {
      // Verify Deliveryman
      const deliveryman = await Deliveryman.findByPk(deliveryman_id);

      if (!deliveryman) {
        return res.status(404).json({ error: 'Deliveryman not found!' });
      }
    }

    const { id } = await Order.update(req.body);

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
    });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found!' });
    }

    await Order.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.send();
  }
}

export default new OrderController();
