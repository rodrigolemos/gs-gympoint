import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
	async store(req, res) {
		const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid)) {
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
}

export default new StudentController();
