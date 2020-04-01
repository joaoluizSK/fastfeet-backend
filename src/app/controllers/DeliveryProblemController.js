import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CancelledDeliveryMail from '../jobs/CancelledDeliveryMail';

class DeliveryProblemController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const bodySchema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await bodySchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const problem = await DeliveryProblem.create({
      order_id: req.params.id,
      description: req.body.description,
    });

    return res.json(problem);
  }

  async index(req, res) {
    const problems = await DeliveryProblem.findAll({});

    return res.json(problems);
  }

  async details(req, res) {
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

    const problems = await DeliveryProblem.findAll({
      where: {
        order_id: req.params.id,
      },
    });
    return res.json(problems);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const problem = await DeliveryProblem.findByPk(req.params.id);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found!' });
    }

    const order = await Order.findByPk(problem.order_id);

    await order.update({
      canceledAt: new Date(),
    });

    const deliveryman = await Deliveryman.findByPk(order.deliveryman_id);
    const recipient = await Recipient.findByPk(order.recipient_id);

    await Queue.add(CancelledDeliveryMail.key, {
      deliveryman,
      problem: problem.description,
      recipient: recipient.name,
      fullAddress: recipient.fullAddress(),
      product: order.product,
    });

    return res.json();
  }
}

export default new DeliveryProblemController();
