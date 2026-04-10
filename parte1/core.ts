const filename = new URL('./data.todo.json', import.meta.url).pathname;
let list: string[] = null!;

async function loadFromFile() {
  if (list !== null)
    return
  try {
    const file = Bun.file(filename);
    const content = await file.text();
    list = JSON.parse(content) as string[];
  } catch (error) {
    Bun.write(filename, "[]");
    list = [];
  }
}

async function saveToFile() {
  await Bun.write(filename, JSON.stringify(list));
}

export async function addItem(item: string) {
  await loadFromFile();
  list.push(item);
  await saveToFile();
}

export async function getItems() {
  await loadFromFile();
  return list;
}

export async function updateItem(index: number, newItem: string) {
  await loadFromFile();
  if (index < 0 || index >= list.length)
    throw new Error("Índice fora dos limites");
  list[index] = newItem;
  await saveToFile();
}

export async function removeItem(index: number) {
  await loadFromFile();
  if (index < 0 || index >= list.length)
    throw new Error("Índice fora dos limites");
  list.splice(index, 1);
  await saveToFile();
}

export default { addItem, getItems, updateItem, removeItem };
