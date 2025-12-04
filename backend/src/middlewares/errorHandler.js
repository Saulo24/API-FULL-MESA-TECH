const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro no console
  console.error('❌ Erro:', err);

  // Erro de ID inválido do Mongoose
  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado';
    error = { message, statusCode: 404 };
  }

  // Erro de duplicação do Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Já existe um registro com este ${field}`;
    error = { message, statusCode: 400 };
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Erro de token JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = { message, statusCode: 401 };
  }

  // Erro de token expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erro interno do servidor'
  });
};

module.exports = errorHandler;

