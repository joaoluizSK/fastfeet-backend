import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipCode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const {
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zipCode,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zipCode,
    });
  }

  async update(req, res) {
    const bodySchema = Yup.object().shape({
      name: Yup.string(),
      complement: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipCode: Yup.string(),
    });

    const paramsSchema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (
      !(await paramsSchema.isValid(req.params)) ||
      !(await bodySchema.isValid(req.body))
    ) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found!' });
    }

    const {
      name,
      street,
      number,
      complement,
      city,
      state,
      zipCode,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zipCode,
    });
  }

  async index(req, res) {
    const recipientsList = await Recipient.findAll();
    return res.json(recipientsList);
  }

  async details(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found!' });
    }

    return res.json(recipient);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found!' });
    }

    await Recipient.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.send();
  }
}

export default new RecipientController();
