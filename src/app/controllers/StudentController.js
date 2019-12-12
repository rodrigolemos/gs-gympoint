import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
	async index(req, res) {
    const { page = 1 } = req.query;
    const students = await Student.findAll({
      limit: 10,
      offset: (page - 1) * 10,
    });
    if (!students) {
      res.status(404).json({
        error: 'There are no students registered.',
      });
    }
    return res.json(students);
  }

  async store(req, res) {
		const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }

    const student = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (student) {
      res.status(401).json({
        error: 'Student already registered.',
      });
    }
    
    const {
      id,
      name,
      email,
    } = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
	}

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation failed.',
      });
    }

    const student = await Student.findOne({
      where: {
        email: req.body.email,
      },
    });
    
    if (!student) {
      res.status(404).json({
        error: 'Student not found.',
      });
    }

    const { name } = await student.update(req.body);

    return res.json({
      msg: `Student ${name} updated.`,
    });
  }
}

export default new StudentController();
