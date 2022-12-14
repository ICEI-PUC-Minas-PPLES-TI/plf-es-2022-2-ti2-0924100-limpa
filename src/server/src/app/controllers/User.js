const pool = require('../../configs/db');
const bcrypt = require('bcryptjs');

const User = require('../services/User');

exports.createUser = async (req, res) => {
  const { cel, password, name, document, type } = req.body;

  const { rowCount } = await pool.query(
    'select 1 from usuario where cpf_cnpj = $1',
    [document]
  );

  if (rowCount) {
    return res
      .status(400)
      .json('Usuário com esse documento já está cadastrado');
  }

  const hash = await bcrypt.hash(password, 8);

  const isDiarista = type === 'diarista';

  try {
    await pool.query(
      `
      INSERT INTO usuario (telefone, senha, nome, cpf_cnpj, is_diarista)
      VALUES ($1, $2, $3, $4, $5);
    `,
      [cel, hash, name, document, isDiarista]
    );

    if (isDiarista) {
      await pool.query(
        `
        INSERT INTO diarista (telefone, chave_pix)
        VALUES ($1, $2)
      `,
        [cel, req.body.pix]
      );
    }

    res.status(200).json('Usuário cadastrado com sucesso!');
  } catch {
    res.status(500).json('Algo deu errado');
  }
};

exports.getUserData = async (req, res) => {
  const { authorization } = req.headers;

  const user = await User.getFromToken(authorization);

  res.status(200).json({ user });
};

exports.rateUser = async (req, res) => {
  try {
    const createdRating = await User.rate(req.body);
    res.json(createdRating);
  } catch (err) {
    res.status(400).json(err);
  }
};
