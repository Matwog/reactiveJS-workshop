import { Observable, timer, from, of } from 'rxjs'
import { take, concatMap, switchMap, catchError, map, onErrorResumeNext } from 'rxjs/operators'
import { fromFetch } from 'rxjs/fetch'

// var observable = Observable.create((observer: any) => {
//     console.log(observer)
//     observer.next('Hello World!');
//     observer.next('Hello Again!');
//     observer.complete();
//     observer.next('Bye');
// })

// observable.subscribe(
//     (x: any) => logItem(x),
//     (error: any) => logItem('Error: ' + error),
//     () => logItem('Completed')
// );

// function logItem(val: any) {
//     var node = document.createElement("li");
//     var textnode = document.createTextNode(val);
//     node.appendChild(textnode);
//     document.getElementById("list")!.appendChild(node);
//     console.log(node)
// }

let newObservable = Observable.create((observer: any) => {
    console.log(observer)

    observer.next(fetch('https://dog.ceo/api/breeds/image/random'))
})

const img = document.createElement('img')
document.getElementById("root")!.appendChild(img)




// let subscription = timer(0, 1000)
//     .pipe(take(10))
//     // .pipe(concatMap((val) => from([`Hello ${val}`, 'Good'])))
//     .pipe(concatMap((val) => from(fetch('https://dog.ceo/api/breeds/image/random'))))
//     .subscribe(
//         (item) => console.log(item),
//         (error) => console.log(error),
//         () => console.log('completed')
//     )

// setTimeout(() => {
//     subscription.unsubscribe()
// }, 5000)

class statusResponse {
    progressCurrent: Number
    progressTotal: Number

    constructor(progressCurrent: Number, progressTotal: Number) {
        this.progressCurrent = progressCurrent
        this.progressTotal = progressTotal
    }
}

class resultResponse {
    status: string

    constructor(status: string) {
        this.status = status
    }
}

class combinedResponse {
    status: statusResponse
    result: resultResponse

    constructor(status: statusResponse, result: resultResponse) {
        this.status = status
        this.result = result
    }
}


let statusObservable: Observable<statusResponse> = Observable.create((observer: any) => {
    let randomNumber = Math.round(Math.random() * 10)
    if (randomNumber % 7 === 0) {
        observer.error('404 not found')
    } else {
        observer.next(new statusResponse(5, 15))
        observer.complete()
    }

})

let resultObservable: Observable<resultResponse> = Observable.create((observer: any) => {
    observer.next(new resultResponse('success'))
    observer.complete()
})

function getResultObservable(status: statusResponse) {
    return resultObservable
        .pipe(map((result) => new combinedResponse(status, result)))
}


timer(0, 1000)
    .pipe(
        take(10),
        concatMap(() => statusObservable),
        onErrorResumeNext(resultObservable)
        // concatMap((data) => getResultObservable(data))
    )
    .subscribe(
        (item) => console.log(item),
        (error) => console.log(error),
        () => console.log('completed')
    )




    // const apiObservableWrapper = () =>
    // fromFetch('https://dog.ceo/api/breeds/image/random')
    //     .pipe(switchMap(response => {
    //         if (response.ok) {
    //             return response.json()
    //         } else {
    //             return of({ error: true, message: `Error ${response.status}` });
    //         }
    //     })
    //     )


// const data = apiObservableWrapper()

// data.subscribe({
//     next: result => console.log(result),
//     error: error => console.log(error),
//     complete: () => console.log('done')
// });