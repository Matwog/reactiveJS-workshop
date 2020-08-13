import { Observable, timer, from } from 'rxjs'
import { take, concatMap } from 'rxjs/operators'

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




let subscription = timer(0, 1000)
    .pipe(take(10))
    // .pipe(concatMap((val) => from([`Hello ${val}`, 'Good'])))
    .pipe(concatMap((val) => from(fetch('https://dog.ceo/api/breeds/image/random'))))
    .subscribe(
        (item) => console.log(item),
        (error) => console.log(error),
        () => console.log('completed')
    )

setTimeout(() => {
    subscription.unsubscribe()
}, 5000)