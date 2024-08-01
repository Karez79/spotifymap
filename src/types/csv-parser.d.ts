declare module 'csv-parser' {
    import { Transform } from 'stream';
  
    interface CsvParserOptions {
      separator?: string;
      newline?: string;
      strict?: boolean;
      headers?: string[] | boolean;
      skipLines?: number;
      maxRowBytes?: number;
      escape?: string;
      mapHeaders?: ({ header, index }: { header: string; index: number }) => string | null;
      mapValues?: ({ header, index, value }: { header: string; index: number; value: string }) => string;
    }
  
    function csv(options?: CsvParserOptions): Transform;
  
    export default csv;
  }
  