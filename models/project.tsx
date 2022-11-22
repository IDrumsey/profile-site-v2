// https://dev.to/kevin_odongo35/object-oriented-programming-with-typescript-574o
export class Project {
    title: string
    description: string
    videoLink?: string
    repoLink?: string
    hosted?: boolean
    liveLink?: string


    constructor(title: string, description: string, hosted: boolean = false, liveLink: string = "") {
        this.title = title
        this.description = description
        this.hosted = hosted
        this.liveLink = liveLink
        if(hosted && liveLink == "") {
            throw Error("Live link needs to be provided if the project is hosted")
        }
    }
}