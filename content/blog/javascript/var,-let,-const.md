---
title: var, let, const 특징
date: 2020-4-15 15:04:83
category: javascript
draft: false
---

## 1. 변수 선언 방식

`var`은 es5 이하에서 사용되던 자바스크립트 변수 선언 방식

같은 변수 선언을 하는데 문제점이 없습니다.
유연하게 변수 선언을 할 수 있다고 볼 수도 있지만 나중에 코드 양이 늘어날 경우 어디서 해당 변수가 선언되었는지 추적하기도 힘들고 값이 변하는 치명적인 문제가 있습니다.

```javascript
var name = 'kevin'
console.log(name) // kevin

var name = 'bibimbab'
console.log(name) // bibimbab
```

`let`과 `const`는 es6 에서 새롭게 등장한 새로운 변수 선언 방식입니다.

`let`은 변수에 값을 재할당을 할 수 있습니다. 이 부분만 봤을 땐 var와 별 차이가 없습니다.
하지만 var와 다르게 변수 재선언이 불가능합니다.
변수 재선언을 할 경우 아래처럼 오류가 뜨면서 선언되지 않습니다.

```javascript
var name = 'kevin'
console.log(name) // kevin

var name = 'bibimbab'
console.log(name)
// Uncaught SyntaxError: Identifier 'name' has already been declared
```

`const`는 상수로써 값을 재할당할 수 없습니다. 변수 재선언도 할 수 없습니다.

```javascript
const name = 'kevin'
console.log(name) // kevin

const name = 'javascript'
console.log(name)
// Uncaught SyntaxError: Identifier 'name' has already been declared

name = 'react'
console.log(name)
//Uncaught TypeError: Assignment to constant variable.
```

다만 `const` 변수 타입이 객체일 경우 **프로퍼티는 보호되지 않는다.** 다시 말하자면 재할당은 불가능하지만 할당된 객체의 내용(프로퍼티의 추가, 삭제, 프로퍼티 값의 변경)은 변경할 수 있다.

```javascript
const user = { name: 'Lee' }

// const 변수는 재할당이 금지된다.
// user = {}; // TypeError: Assignment to constant variable.

// 객체의 내용은 변경할 수 있다.
user.name = 'Kim'

console.log(user) // { name: 'Kim' }
```

## 2. 블록 레벨 스코프

모든 코드 블록(함수, if 문, for 문, while 문, try/catch 문 등) 내에서 선언된 변수는 코드 블록 내에서만 유효하며 코드 블록 외부에서는 참조할 수 없습니다. 즉, 코드 블록 내부에서 선언한 변수는 지역 변수입니다. 아래 예제를 보겠습니다.

`var`는 블록 레벨 스코프를 따르지 않습니다. 그러므로 var의 특성 상, 코드 블록 내의 변수 foo는 전역 변수이다. 그런데 이미 같은 전역 변수인 foo가 선언되어 있습니다. var는 중복 선언이 허용되므로 아래의 코드는 문법적으로 아무런 문제가 없습니다. 그래서 코드 블록 내의 변수 foo는 전역에서 선언된 전역 변수 foo의 값 123을 새로운 값 456으로 재할당하여 덮어쓰게 됩니다.

```javascript
var foo = 123 // 전역 변수

console.log(foo) // 123

{
  var foo = 456 // 전역 변수
}

console.log(foo) // 456
```

반면 `let`과 `const`는 블록 레벨 스코프를 따릅니다. 아래 예제에서 코드 블록 내에 선언된 변수 foo는 블록 레벨 스코프를 갖는 지역 변수이다. 전역에 선언된 변수 foo와는 다른 별개의 변수입니다. 변수 bar 또한 블록 레벨 스코프를 갖는 지역 변수입니다. 따라서 전역에서는 변수 bar를 참조할 수 없습니다.

```javascript
let foo = 123 // 전역 변수

{
  let foo = 456 // 지역 변수
  let bar = 456 // 지역 변수
  const FOO = 10

  console.log(FOO) //10
}

console.log(foo) // 123
console.log(bar) // ReferenceError: bar is not defined
console.log(FOO) // ReferenceError: FOO is not defined
```

## 3. 호이스팅

호이스팅(Hoisting)이란, var나 function을 해당 스코프의 선두로 옮긴 것처럼 동작하는 특성을 말합니다.

`var`로 선언한 변수는 console.log() 호출보다 늦게 선언을 했음에도 불구하고 인식헙나다. 반면 `let`과 `const`는 참조에러(referenceError)가 발생합니다.

```javascript
console.log(foo) // undefined
var foo

console.log(bar) // Error: Uncaught ReferenceError: bar is not defined
let bar
```

좀 더 변수 선언에 대해 알아보자면 변수 선언은 크게 3단계로 이루어 집니다.

### 선언 단계(Declaration phase)

변수를 실행 컨텍스트의 변수 객체(Variable Object)에 등록합니다. 이 변수 객체는 스코프가 참조하는 대상이 됩니다.

### 초기화 단계(Initialization phase)

변수 객체(Variable Object)에 등록된 변수를 위한 공간을 메모리에 확보합니다. 이 단계에서 변수는 undefined로 초기화됩니다.

### 할당 단계(Assignment phase)

undefined로 초기화된 변수에 실제 값을 할당합니다.

var같은 경우엔 선언 단계와 초기화 단계가 동시에 이루어집니다. 즉, 스코프에 변수를 등록(선언 단계)하고 메모리에 변수를 위한 공간을 확보한 후, undefined로 초기화(초기화 단계)합니다. 따라서 변수 선언문 이전에 변수에 접근하여도 스코프에 변수가 존재하기 때문에 에러가 발생하지 않으며 undefined를 반환합니다. 이후 변수 할당문에 도달하면 비로소 값이 할당합니다. 이러한 현상을 **변수 호이스팅(Variable Hoisting)**이라 합니다.

```javascript
// 스코프의 선두에서 선언 단계와 초기화 단계가 실행된다.
// 따라서 변수 선언문 이전에 변수를 참조할 수 있다.
console.log(foo) // undefined

var foo
console.log(foo) // undefined

foo = 1 // 할당문에서 할당 단계가 실행된다.
console.log(foo) // 1
```

`let` 키워드로 선언된 변수는 선언 단계와 초기화 단계가 분리되어 진행됩니다. 즉, 스코프에 변수를 등록(선언단계)하지만 초기화 단계는 변수 선언문에 도달했을 때 이루어집니다. 초기화 이전에 변수에 접근하려고 하면 참조 에러(ReferenceError)가 발생합니다. 이는 변수가 아직 초기화되지 않았기 때문입니다. 다시 말하면 변수를 위한 메모리 공간이 아직 확보되지 않았기 때문입니다. 따라서 스코프의 시작 지점부터 초기화 시작 지점까지는 변수를 참조할 수 없습니다. 스코프의 시작 지점부터 초기화 시작 지점까지의 구간을 **일시적 사각지대(Temporal Dead Zone; TDZ)**라고 부릅니다.

```javascript
// 스코프의 선두에서 선언 단계가 실행된다.
// 아직 변수가 초기화(메모리 공간 확보와 undefined로 초기화)되지 않았다.
// 따라서 변수 선언문 이전에 변수를 참조할 수 없다.
console.log(foo) // ReferenceError: foo is not defined

let foo // 변수 선언문에서 초기화 단계가 실행된다.
console.log(foo) // undefined

foo = 1 // 할당문에서 할당 단계가 실행된다.
console.log(foo) // 1
```

이렇게 보면 ES6에선 호이스팅이 발생하지 않는 것과 차이가 없어 보입니다. 하지만 그렇지는 않습니다.

아래 예제를 보시면 전역 변수 foo의 값이 출력될 것처럼 보입니다. 하지만 ES6의 선언문도 여전히 호이스팅이 발생하기 때문에 참조 에러(ReferenceError)가 발생하게 됩니다.

ES6의 let으로 선언된 변수는 블록 레벨 스코프를 가지므로 코드 블록 내에서 선언된 변수 foo는 지역 변수입니다. 따라서 지역 변수 foo도 해당 스코프에서 호이스팅되고 코드 블록의 선두부터 초기화가 이루어지는 지점까지 일시적 사각지대(TDZ)에 빠지게 됩니다. 따라서 전역 변수 foo의 값이 출력되지 않고 참조 에러(ReferenceError)가 발생합니다.

```javascript
let foo = 1 // 전역 변수

{
  console.log(foo) // ReferenceError: foo is not defined
  let foo = 2 // 지역 변수
}
```

## 4. 클로저

아래의 코드의 결과는 0, 1, 2를 기대할 수도 있지만 결과는 3이 세 번 출력됩니다. 그 이유는 for 루프의 var i가 전역 변수이기 때문이다.

```javascript
var funcs = []

// 함수의 배열을 생성하는 for 루프의 i는 전역 변수다.
for (var i = 0; i < 3; i++) {
  funcs.push(function() {
    console.log(i)
  })
}

// 배열에서 함수를 꺼내어 호출한다.
for (var j = 0; j < 3; j++) {
  funcs[j]()
}
```

0, 1, 2를 출력하려면 아래와 같이 클로저를 활용해야 합니다.
자바스크립트의 함수 레벨 스코프로 인하여 for 루프의 초기화 식에 사용된 변수가 전역 스코프를 갖게 되어 발생하는 문제를 회피하기 위해 클로저를 사용했습니다.

```javascript
var funcs = []

for (var i = 0; i < 3; i++) {
  ;(function(index) {
    // index는 자유변수다.
    funcs.push(function() {
      console.log(index)
    })
  })(i)
}

for (var j = 0; j < 3; j++) {
  funcs[j]()
}
```

반면 `let`을 for 루프의 초기화 식에 사용하면 클로저를 사용하지 않아도 위 코드와 동일한 동작을 합니다.
for 루프의 let i는 for loop에서만 유효한 지역 변수입니다. 또한, i는 자유 변수로서 for 루프의 생명주기가 종료되어도 변수 i를 참조하는 함수가 존재하는 한 계속 유지됩니다.

```javascript
var funcs = []

// 함수의 배열을 생성하는 for 루프의 i는 for 루프의 코드 블록에서만 유효한 지역 변수이면서 자유 변수이다.
for (let i = 0; i < 3; i++) {
  funcs.push(function() {
    console.log(i)
  })
}

for (var j = 0; j < 3; j++) {
  console.dir(funcs[j])
  funcs[j]()
}
```

## 5. 전역 객체

전역 객체(Global Object)는 모든 객체의 유일한 최상위 객체를 의미하며 일반적으로 Browser-side에서는 window 객체, Server-side(Node.js)에서는 global 객체를 의미합니다. `var`로 선언된 변수를 전역 변수로 사용하면 전역 객체의 프로퍼티가 됩니다.

```javascript
var foo = 123 // 전역변수

console.log(window.foo) // 123
```

`let` 키워드로 선언된 변수를 전역 변수로 사용하는 경우, let 전역 변수는 전역 객체의 프로퍼티가 아닙니다. 즉, window.foo와 같이 접근할 수 없습니다. let 전역 변수는 보이지 않는 개념적인 블록 내에 존재하게 됩니다.

```javascript
let foo = 123

console.log(window.foo) // undefined
```

## 참조문서

<https://poiemaweb.com/es6-block-scope>
