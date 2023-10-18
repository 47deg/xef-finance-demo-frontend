import { createPool, QueryResult, QueryResultRow} from "@vercel/postgres";
import {TableResponse} from "@/utils/api.ts";

const postgres_url = `${import.meta.env.VITE_POSTGRES_URL}`;

const pool = createPool({
  connectionString: postgres_url
});

export type QueryResponse = {
  rowCount: number;
  columnsCount: number;
  tableResponse?: TableResponse;
};


function rowToCategory(row: QueryResultRow): Category {
  return {
    name: row.category1,
    totalAmount: row.total_amount
  }
}

function rowToTransaction(row: QueryResultRow): Transaction {
  return {
    id: row.id,
    date: row.date,
    transaction_details: row.transaction_details,
    amount: row.amount,
    type: row.type,
    category1: row.category1,
    category2: row.category2,
    channel: row.channel,
    source: row.source,
    city: row.city,
    carbon: row.carbon
  }
}

function getItems(columns: string[], row: QueryResultRow): string[] {
  return columns.map(el => row[el] as string);
}

export async function CurrentCategories(): Promise<Category[]> {
  const qr: QueryResult<QueryResultRow> = await pool.sql`SELECT category1, SUM(amount) AS total_amount FROM transaction WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)GROUP BY category1`;
  return qr.rows.map((row) => rowToCategory(row));
}

export async function TransactionsPerCategory(name: string): Promise<Transaction[]> {
  const qr: QueryResult<QueryResultRow> = await pool.sql`SELECT * FROM transaction WHERE category1=${name} ORDER BY date DESC`;
  return qr.rows.map((row) => rowToTransaction(row));
}


export async function GenericQuery(query: string) {

  const client = await pool.connect();
  let qr = null;
  try {
    qr = await client.query('SELECT * FROM transaction WHERE category1=$1 ORDER BY date DESC', ['BROKERAGE']);
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }


  // let c = `SELECT category1, SUM(amount) AS total_amount FROM transaction WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)GROUP BY category1`;
  // const qr = await pool.sql`${c}`;
  // const qr = await pool.sql`SELECT category1, SUM(amount) AS total_amount FROM transaction WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)GROUP BY category1`;
  // const qr = await pool.query('SELECT * FROM transaction WHERE category1=$1 ORDER BY date DESC', ['BROKERAGE']);


  let myTableResponse: TableResponse = null;

  if(qr.rowCount > 0 && qr.fields.length > 0) {
    let myColumns: string[] = qr.fields.map((field) => field.name);
    console.log(myColumns);
    let myRows: string[][] = qr.rows.map(row => getItems(myColumns, row));
    console.log(myRows);
    myTableResponse = {
      columns: myColumns,
      rows: myRows
    }
  }

  const myQueryResponse: QueryResponse = {
    rowCount: qr.rowCount,
    columnsCount: qr.fields.length,
    tableResponse: myTableResponse
  }

  return myQueryResponse
}
