import Mail from '../../lib/Mail';

class CancelledDeliveryMail {
  get key() {
    return 'CancelledDeliveryMail';
  }

  async handle({ data }) {
    // pegar os parâmetros necessários
    const { recipient, deliveryman, product, fullAddress, problem } = data;

    // Aqui vai a ação que deve ser realizada
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Entrega Cancelada',
      template: 'cancelledDelivery',
      context: {
        deliveryman: deliveryman.name,
        product,
        recipient,
        fullAddress,
        problem,
      },
    });
  }
}

export default new CancelledDeliveryMail();
