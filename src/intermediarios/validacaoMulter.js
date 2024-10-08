const multer = require('../multer')

module.exports = async (req, res, next) => {
    try {
        if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) return res.status(400).json({ mensagem: 'Nenhuma parametro foi enviado.' });
        
        multer.single('imagem')(req, res, (err) => {
            const { file } = req
            const { imagem } = req.body

            if(file && !file.mimetype.startsWith('image/')) return res.status(400).json({ mensagem: 'Arquivo incorreto, apenas imagem é aceito.' })
                
            if (err || !file && imagem === undefined) return res.status(400).json({ mensagem: 'Parâmetro incorreto.' });
            
            return next()
        })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro no servidor.' });
    }
}