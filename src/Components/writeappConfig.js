import { Client ,Databases} from 'appwrite';

export const PROJECT_ID ='66f8c48c001e445a4938'
export const DATABASE_ID ='my_data'
export const COLLECTION_ID_MESSAGE ='66f8cad300284ca8559e'
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66f8c48c001e445a4938');

export const databases = new Databases(client);


export default client;