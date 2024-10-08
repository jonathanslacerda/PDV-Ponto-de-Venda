const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')

const s3Client = new S3Client({
    forcePathStyle: true,
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACESS_KEY
    }
})

const uploadImagemStorage = async (path, buffer, mimetype) => {
    const imagem = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: path,
        Body: buffer,
        ContentType: mimetype
    })
    
    await s3Client.send(imagem)

    return {
        url: `${process.env.S3_URL_PATH_STORAGE}${path}`
    }
}

const excluirImagemStorage = async (path) => {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: path
        };
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
    
        return {
            mensagem: 'Imagem excluida com sucesso'
        }
    } catch (error) {
        return {
            mensagem: 'Falha ao excluir imagem'
        }
    }
}

module.exports = {
    uploadImagemStorage,
    excluirImagemStorage
}