import Service from '../services/Service.js';
import User from '../services/User.js';

export const createService = async (req, res) => {
  const { desc, dateTime, rooms, value, address } = req.body;

  if (!desc || !dateTime || !rooms || !value || !address.cep) {
    return res.status(400).json('Preencha os campos obrigatórios');
  }

  const user = await User.getFromToken(req.headers.authorization);

  const service = await Service.create(req.body, user.telefone);

  res.status(201).json(service);
};
