import { ToDo, Item } from './core.ts';

const file = process.argv[2];
const command = process.argv[3];


if (!file) {
  console.error("Informe o arquivo. Ex: lista.json");
  process.exit(1);
}

const todo = new ToDo(file);

if (command === "add") {
  const description = process.argv[4];

  if (!description) {
    console.error("Informe a descrição.");
    process.exit(1);
  }

  const item = new Item(description);
  await todo.addItem(item);

  console.log("Item adicionado!");
  process.exit(0);
}

if (command === "list") {
  const items = await todo.getItems();

  if (items.length === 0) {
    console.log("Lista vazia.");
    process.exit(0);
  }

  console.log("Lista:");
  items.forEach((item, index) => {
    console.log(`${index}: ${item.toJSON().description}`);
  });

  process.exit(0);
}

if (command === "update") {
  const index = parseInt(process.argv[4]);
  const newDescription = process.argv[5];

  if (isNaN(index) || !newDescription) {
    console.error("Use: update <index> <nova descrição>");
    process.exit(1);
  }

  try {
    const item = new Item(newDescription);
    await todo.updateItem(index, item);

    console.log("Atualizado!");
  } catch (error: any) {
    console.error(error.message);
  }

  process.exit(0);
}

if (command === "remove") {
  const index = parseInt(process.argv[4]);

  if (isNaN(index)) {
    console.error("Informe um índice válido.");
    process.exit(1);
  }

  try {
    await todo.removeItem(index);
    console.log("Removido!");
  } catch (error: any) {
    console.error(error.message);
  }

  process.exit(0);
}
console.error("Comando inválido.");
process.exit(1);