import { ToDo, Item } from "./core.ts";

const filepath = "./lista.json";
const todo = new ToDo(filepath);
const port = 3000;

Bun.serve({
  port: port,

  async fetch(request: Request) {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    if (pathname === "/items" && method === "GET") {
      const items = await todo.getItems();
      return Response.json(items.map(i => i.toJSON()));
    }

    if (pathname === "/items" && method === "POST") {
      try {
        const body = await request.json();
        const { description } = body;

        if (!description) {
          return Response.json(
            { error: "Descrição obrigatória" },
            { status: 400 }
          );
        }

        const item = new Item(description);
        await todo.addItem(item);

        return Response.json(
          { message: "Item criado", item: item.toJSON() },
          { status: 201 }
        );
      } catch {
        return Response.json(
          { error: "Erro ao criar item" },
          { status: 500 }
        );
      }
    }


    if (pathname === "/items" && method === "PUT") {
      try {
        const index = parseInt(searchParams.get("index") || "");

        if (isNaN(index)) {
          return Response.json(
            { error: "Index inválido" },
            { status: 400 }
          );
        }

        const body = await request.json();
        const { description } = body;

        if (!description) {
          return Response.json(
            { error: "Descrição obrigatória" },
            { status: 400 }
          );
        }

        const item = new Item(description);
        await todo.updateItem(index, item);

        return Response.json({ message: "Atualizado com sucesso" });
      } catch {
        return Response.json(
          { error: "Erro ao atualizar" },
          { status: 500 }
        );
      }
    }

    if (pathname === "/items" && method === "DELETE") {
      try {
        const index = parseInt(searchParams.get("index") || "");

        if (isNaN(index)) {
          return Response.json(
            { error: "Index inválido" },
            { status: 400 }
          );
        }

        await todo.removeItem(index);

        return Response.json({ message: "Removido com sucesso" });
      } catch {
        return Response.json(
          { error: "Erro ao remover" },
          { status: 500 }
        );
      }
    }

    return Response.json({ error: "Rota não encontrada" }, { status: 404 });
  }
});

console.log(`Servidor rodando em http://localhost:${port}`);