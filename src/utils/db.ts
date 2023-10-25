import {FullQueryResults, neon, NeonQueryFunction, QueryResultRow, QueryRows} from '@neondatabase/serverless';
import {TableResponse} from "@/utils/api.ts";
import {dateNicely} from "@/utils/strings.ts";

const postgres_url = `${import.meta.env.VITE_POSTGRES_URL}`;

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

function getItem(row: QueryResultRow, columnName: string, index: number): string {
  if(columnName.includes('date') || columnName.includes('Date')) return dateNicely(row[index] as Date)
  else return row[index] as string
}

function getItems(columns: string[], row: QueryResultRow): string[] {
  return columns.map((element, i) => getItem(row, element, i));
}

export async function CurrentCategories(): Promise<Category[]> {
  const sql: NeonQueryFunction<false, false> = neon(postgres_url);
  const qr = await sql('SELECT category1, SUM(amount) AS total_amount FROM transaction WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)GROUP BY category1', []);
  return qr.map((row) => rowToCategory(row));
}

export async function TransactionsPerCategory(name: string): Promise<Transaction[]> {
  const sql: NeonQueryFunction<false, false> = neon(postgres_url);
  const qr: QueryRows<boolean> = await sql('SELECT * FROM transaction WHERE category1=$1 ORDER BY date DESC', [name]);
  return qr.map((row) => rowToTransaction(row));
}


export async function GenericQuery(query: string) {
  const options = { arrayMode: true, fullResults: true };
  const sql: NeonQueryFunction<boolean, boolean> = neon(`${import.meta.env.VITE_POSTGRES_URL}`, options);
  const qr: FullQueryResults<boolean> = await sql(query, []);
  let myTableResponse: TableResponse = null;

  if(qr.rowCount > 0 && qr.fields.length > 0) {
    let myColumns: string[] = qr.fields.map((field) => field.name);
    let myRows: string[][] = qr.rows.map(row => getItems(myColumns, row));
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
