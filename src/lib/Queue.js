import Bee from 'bee-queue';
import redisConfig from '../config/redis';
import OrderDetailsMail from '../app/jobs/OrderDetailsMail';
import CancelledDeliveryMail from '../app/jobs/CancelledDeliveryMail';

// Cada new job criado deve ser adicionado aqui
const jobs = [OrderDetailsMail, CancelledDeliveryMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle, // function dentro do job
      };
    });
  }

  // Adicionar o job
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // utilizado para executar a queue em um processo diferente
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.hadleFailure).process(handle);
    });
  }

  hadleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
