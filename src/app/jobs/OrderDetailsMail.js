import Mail from '../../lib/Mail';

class OrderDetailsMail {
  get key() {
    return 'OrderDetailsMail';
  }

  async handle({ data }) {
    // pegar os parâmetros necessários
    const { recipient, deliveryman, product, fullAddress } = data;

    // Aqui vai a ação que deve ser realizada
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Encomenda Cadastrada',
      template: 'orderDetails',
      context: {
        deliveryman: deliveryman.name,
        product,
        recipient,
        fullAddress,
      },
    });
  }
}

export default new OrderDetailsMail();
