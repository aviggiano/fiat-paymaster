const database: Record<string, any> = {};
export async function get(key: string): Promise<any> {
  console.log("database.get", key);
  return Promise.resolve(database[key]);
}
export async function set(key: string, value: any): Promise<any> {
  console.log("database.set", key, value);
  database[key] = value;
  return Promise.resolve(database[key]);
}
