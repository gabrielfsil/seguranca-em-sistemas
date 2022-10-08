import express from "express";
import { sign, verify } from "jsonwebtoken";

// Chave secreta para gerar os tokens de autenticação da aplicação
const secret = "e96d16e0e97ce4f1bc397156eb34c9a8";

const app = express();

app.use(express.json());

// Rota pública para autenticação do usuário
app.post("/auth", (request, response) => {
  const { email, password } = request.body;

  // Verifica email e senha do usuário no banco
  if(email && password){
      
      // Gera um token de acesso para o usuário
      const token = sign({ email }, secret);
    
      return response.json({
        token,
      });
  }
  return response.status(401).json({
    message: "Unauthorized"
  })

});

const authMiddleware = (request, response, next) => {
  const authHeader = request.headers.authorization;

  //   Verifica se um token foi passado na requisição
  if (!authHeader) {
    return response.status(401).json({ message: "JWT token is missing" });
  }

  // O token tem o formato 'Bearer {...token}'
  const [, token] = authHeader.split(" ");

  try {
    // Verifica se o token foi gerado pela chave secreta da aplicação
    verify(token, secret);

    // Caso o token esteja correto ele permiti que o usuário acesso o serviço desejado
    return next();
  } catch (err) {
    // Caso contrário retorna um erro para o usuário
    return response.status(401).json({ message: "Invalid JWT" });
  }
};

// Rota privada na aplicação
app.get("/private",authMiddleware,(request,response) => {

    // Se a requisição passar pelo middleware ele acessará o serviço privado da aplicação
    return response.json({
        message: "Authenticated user."
    })
});

app.listen(3333, () => {
  console.log("Server running in port 3333");
});
