/*
    -> Objetivo:
                Criar uma API de Usuários:
                - Criar um usuário
                - Listar todos os usuários
                - Editar um usuário
                - Deletar um usuário

    -> Data: 17/11/2024
    -> Versão: 1.0
    -> Desenvolvedor: Giovanna Xavier
*/

import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())

// criar o usuário
app.post('/v1/api-users/users', async function(request, response){

    //cria o usuário por body e salva no db
    await prisma.user.create({
        data: {
            email: request.body.email,
            name: request.body.name,
            age: request.body.age
        }
    })

    response.status(201).json(request.body) //informa que o usuário foi criado e retorna ele
})

// listar os usuários
app.get('/v1/api-users/users', async function(request, response){
    let users = []

    //filtro de busca (nome, idade ou email)
    if(request.query){
        users = await prisma.user.findMany({
            where: {
                name: request.query.name,
                age: request.query.age,
                email: request.query.email
            }
        })
    }else{
        users = await prisma.user.findMany()
    }
    
    response.status(200).json(users) //retorna os usuários
})

// editar usuário (id do user)
app.put('/v1/api-users/users/:id', async function (request, response){
    
    await prisma.user.update({
        where: {
            id: request.params.id
        },
        data: {
            email: request.body.email,
            name: request.body.name,
            age: request.body.age
        }
    })

    response.status(201).json(request.body)
})

// deleta usuário (id do user)
app.delete('/v1/api-users/users/:id', async function(request, response){

    await prisma.user.delete({
        where: {
            id:request.params.id
        }
    })

    response.status(200).json({message: "Usuário deletado com sucesso!"})
})

app.listen(3000)