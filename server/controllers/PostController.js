import PostModel from "../models/Post.js"

//Создание поста
export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()
        res.json({ post })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось создать статью"
        })
    }
}

//получение тэгов
export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(el => el.tags)
                          .flat()
                          .slice(0, 5)
        console.log(tags)
        res.json(tags)
    } catch (error) {
        console.log(error)
    }
}


//Получиние всех статей
export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user").exec()
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось найти статью'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.findOneAndUpdate(
            { _id: postId },                                      //первый аргумент
            { $inc: { viewCount: 1 } },                              //второй аргумент  !инкрементируем на 1!
            { returnDocument: "after" },                          //третий аргумен - возвращаем документ
            (err, doc) => {                                       //четвертый аргумет(функция)
                if (err) { return res.status(500).json({ message: "Не удалось получить статьи" }) }
                if (!doc) { return res.status(404).json({ message: "Статья не найдена" }) }
                res.json(doc)
            }
        )

    } catch (error) {

    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        await PostModel.findOneAndDelete(
            { _id: postId },
            (err, doc) => {
                if (err) { return res.status(500).json({ message: "Не удалось удалить статью" }) }
                if (!doc) { return res.status(500).json({ message: "Статья не нашлась" }) }
                res.json({ success: true })
            }

        )
    } catch (error) {

    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        console.log({ postId })
        const post = await PostModel.findByIdAndUpdate(
            { _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            }
        )
        res.json({ success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Not found"
        })
    }
}