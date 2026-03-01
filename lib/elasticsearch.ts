import { Client } from '@elastic/elasticsearch';

const isProduction = process.env.NODE_ENV === "production";

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || (isProduction ? "http://localhost:9200" : "http://172.18.16.1:9200"),
});

if (!isProduction) {
  console.log("Elasticsearch activo en modo desarrollo");
}

export default elasticClient;