import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
	async index(req, res) {
		const { page = 1 } = req.query;
    const plans = await Plan.findAll({
      limit: 10,
      offset: (page - 1) * 10,
    });
		if (!plans) {
			return res.status(400).json({
				error: 'There are no plans registered.',
			});
		}
		return res.json(plans);
	}

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required().positive().integer(),
      price: Yup.number().required().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }

    const { title, duration, price } = Plan.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().positive().integer(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }

    const plan = await Plan.findByPk(req.body.id);
    if (!plan) {
      return res.status(404).json({
        error: 'Plan not found.',
      });
    }
    const { id, title, duration, price } = await plan.update(req.body);
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.body.id);
    if (!plan) {
      return res.status(404).json({
        error: 'Plan not found.',
      });
    }

    plan.updated_at = new Date();
    await plan.save();

    return res.json({
      plan
    });
  }

}

export default new PlanController();
