import {EMPTY, empty, Observable, Subscription, timer} from 'rxjs'
import {catchError, concatMap} from 'rxjs/operators'

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

function getRandomNumber() {
    return Math.round(Math.random() * 10);
}

let statusReturnEmpty = false
let statusObservable: Observable<statusResponse> = new Observable((observer: any) => {
    if (getRandomNumber() % 7 === 0 || statusReturnEmpty) {
        statusReturnEmpty = true
        console.log(">>> status enpoint: emitting an error")
        observer.error('404 not found')
    } else {
        observer.next(new statusResponse(5, 15))
        observer.complete()
    }

})

let resultReturnSomething = false
let resultObservable: Observable<resultResponse> = new Observable((observer: any) => {
    if (getRandomNumber() % 7 === 0 || resultReturnSomething) {
        resultReturnSomething = true
        observer.next(new resultResponse('success'))
        observer.complete()
    } else {
        console.log(">>> result endpoint: emitting an error")
        observer.error('404 not found (Result)')
    }
})

let pollSubscription = Subscription.EMPTY 

function subscribePoll() {
    pollSubscription.unsubscribe()
    
    // Update UI accordingly
    // show progress bar
    
    pollSubscription = timer(0, 1000)
        .pipe(
            concatMap(() => statusObservable.pipe(
                catchError((err) => resultObservable),
                catchError((err) => EMPTY)
            )))
        .subscribe(
            (item) => {
                // Update the UI 
                if (item instanceof statusResponse) {
                    console.log(`${item.progressCurrent} of ${item.progressTotal}`)
                    // update the progress bar
                } else if (item instanceof resultResponse) {
                    console.log(`Import completed! ${item.status}`)
                    pollSubscription.unsubscribe()
                    // hide the progress bar
                }
            },
            (error) => {
                // build the dialog with message'n'everything
                let retryAction = () => subscribePoll()
                console.log(error)
            },
            () => {
                // Hide the import dialog
                console.log('completed')
            }
        )
}

subscribePoll()

// setInterval(() => {
//     console.log("Oi! Let's subscribe again!")
//     subscribePoll()
// }, 2000)

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