import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import open from 'open';

import { CreateAccountDTO } from './application/dto/create-account.dto';

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, './data/accounts.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));


app.listen(PORT, async () => {
    console.log(`ervidor iniciado emh ttp://localhost:${PORT}`)
    try {
        await open(`http://localhost:${PORT}/index.html`);
    } catch (error) {
        console.error('Não foi possível abrir o navegador automaticamente:', error);
    }
});

interface Account {
    id: string;
    dominio: string
    email?: string
    user?: string
    password: string
    additional_info?: string
}

async function readAccounts(): Promise<Account[]> {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');

        return JSON.parse(data);

    } catch (error) {
        return [];
    }
}

async function writeAccounts(accounts: Account[]): Promise<void> {
    await fs.writeFile(
        FILE_PATH,
        JSON.stringify(accounts, null, 2),
        'utf-8'
    );
}

app.get('/accounts', async (req: Request, res: Response) => {
    try {

        const accounts = await readAccounts();

        return res.json(accounts);

    } catch (error) {

        return res.status(500).json({
            error: 'Erro ao ler accounts'
        });

    }
});

app.post('/accounts', async (req: Request, res: Response) => {
    try {

        const body: CreateAccountDTO = req.body;

        if (!body.dominio) {
            return res.status(400).json({
                error: 'Domain field is required'
            });
        }

        const accounts = await readAccounts();

        const add_info = body.additional_info ?? "";
        const usr = body.user ?? "";
        const verified_email = body.email ?? "";

        const newAccount: Account = {
            id: Date.now().toString(),
            dominio: body.dominio,
            email: verified_email,
            user: usr,
            password: body.password,
            additional_info: add_info
        };

        accounts.push(newAccount);

        await writeAccounts(accounts);

        return res.status(201).json(newAccount);

    } catch (error) {

        return res.status(500).json({
            error: 'Erro ao salvar account'
        });

    }
});

app.put('/accounts/:id', async (req, res) => {

    try{
        
        const {id} = req.params;
        const account = await readAccounts();

        const accountIndex = account.findIndex(a => a.id == id);

        if (accountIndex === -1) {
            return res.status(404).json({ error: 'account not found.' })
        }
        
        await writeAccounts(account);
        
        res.json(account[accountIndex])

    } catch {
        res.status(500).json({error: "Error updating account."})
    }

});

app.delete('/accounts/:id', async (req, res) => {

    try{
        
        const {id} = req.params;
        const account = await readAccounts();

        const accountFiltered = account.filter(a => a.id == id);

        if (account.length === accountFiltered.length) {
            return res.status(404).json({error: 'account not found.'})
        }

        await writeAccounts(accountFiltered);
        res.json({message: 'Account deletada com sucesso.'})
    } catch {
        res.status(500).json({error: "Error deleting account"})
    }

});


// listener
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
