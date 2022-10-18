import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

/*type VideosType = {
}*/

let videos = [
    {
        id: +(new Date().getTime()),
        title: "hello",
        author: "Author A",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(Date.now()).toISOString(),
        publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
        availableResolutions: ["P144"]
    },
    {
        id: +(new Date().getTime()),
        title: "world",
        author: "Author B",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(Date.now()).toISOString(),
        publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
        availableResolutions: ["P144"]
    }
]

const parserMiddleware = bodyParser()
app.use(parserMiddleware)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})
app.post('/videos', (req: Request, res: Response) => {

    let title = req.body.title
    let author = req.body.author
    const errors = []


    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        errors.push({
            message: "Incorrect title",
            field: "title"
        })
    }

    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        errors.push({
            message: "Incorrect author",
            field: "author"
        })
    }

    /*enum enumAvailableResolutions {
        P144 = "P144",
        P240 = "P144",
        P360 = "P360",
        P480 = "P480",
        P720 = "P720",
        P1080 = "P1080",
        P1440 = "P1440",
        P2160 = "P2160"
    }*/

    const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]

    const errorArrAvailableResolutons = req.body.availableResolutions
        .filter((item: any) => !Object.values(availableResolutions).includes(item))

    if (errorArrAvailableResolutons.length > 0) {
        errors.push({
            message: "Incorrect resolution",
            field: "availableResolutions"
        })
    }

    if (errors.length) {
        res.status(400).send({errorsMessages: errors})
        return;
    }

    const newVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(Date.now()).toISOString(),
        publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
        availableResolutions: req.body.availableResolutions
    }

    videos.push(newVideo)
    res.status(201).send(newVideo)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {

    let video = videos.find(v => v.id === +req.params.videoId)
    if (!video) {
        res.sendStatus(404)
    } else {
        res.status(200).send(video)
    }
})
app.put('/videos/:videoId', (req: Request, res: Response) => {

    let title = req.body.title
    let author = req.body.author
    let canBeDownloaded = req.body.canBeDownloaded
    let minAgeRestriction = req.body.minAgeRestriction
    let publicationDate = req.body.publicationDate
    const errors = []

    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        errors.push({
            message: "Incorrect title",
            field: "title"
        })
    }

    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        errors.push({
            message: "Incorrect author",
            field: "author"
        })
    }

    if (!publicationDate || publicationDate.length !== 12 || isNaN(Date.parse(publicationDate))) {
        errors.push({
            message: "Incorrect publication date",
            field: "publicationDate"
        })
    }

    if ((minAgeRestriction < 1 || minAgeRestriction > 18) && minAgeRestriction != null) {
        errors.push({
            message: "Incorrect age",
            field: "minAgeRestriction"
        })
    }

    if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
        errors.push({
            message: "Should be boolean",
            field: "canBeDownloaded"
        })
    }

    /*enum enumAvailableResolutions {
        P144 = "P144",
        P240 = "P144",
        P360 = "P360",
        P480 = "P480",
        P720 = "P720",
        P1080 = "P1080",
        P1440 = "P1440",
        P2160 = "P2160"
    }*/

    const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]

    const errorArrAvailableResolutons = req.body.availableResolutions
        .filter((item: any) => !Object.values(availableResolutions).includes(item))

    if (errorArrAvailableResolutons.length > 0) {
        errors.push({
            message: "Incorrect resolution",
            field: "availableResolutions"
        })
    }

    if (errors.length) {
        res.status(400).send({errorsMessages: errors})
        return;
    }

    const id = +req.params.videoId
    let video = videos.find(v => v.id === id)

    if (!video) {
        res.sendStatus(404)
    } else {
        video.title = title
        video.author = author
        video.canBeDownloaded = req.body.canBeDownloaded
        video.minAgeRestriction = req.body.minAgeRestriction
        video.publicationDate = req.body.publicationDate
        video.availableResolutions = req.body.availableResolutions
        res.sendStatus(204)
    }
})
app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId
    const newVideos = videos.filter(v => v.id !== id)
    if (newVideos.length < videos.length) {
        videos = newVideos
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    let result = videos.splice(0, videos.length - 1)
    if (result) {
        res.status(204).send(result)
    } else {
        res.status(404)
    }

})

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})