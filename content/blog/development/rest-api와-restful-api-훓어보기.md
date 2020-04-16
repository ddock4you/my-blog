---
title: REST API와 RESTful API 훓어보기
date: 2020-04-15 18:04:53
category: development
draft: false
---

## 1. REST란?

Representational State Transfe라는 용어의 약자입니다.</br>
HTTP URI(Uniform Resource Identifier)로 잘 표현된 자원(Resource)에 대한 행위를 의미합니다.

조금 더 설명을 덧붙이자면 여기서 말하는 자원(Resource)는 문서, 그림, 각종 데이터가 될 수 있으며 각 자원마다 고유한 ID인 HTTP URI를 통해 자원을 명시합니다.
그리고 HTTP 메소드(method)를 통해 어떤 행동을 할지 정해주고 결과를 받을 수 있는 것을 말합니다.

### REST 구성 요소

#### 자원(Resource): URI (Uniform Resource Identifier)

- 모든 자원에 고유한 ID가 존재하고, 이 자원은 Server에 존재합니다.</br>
  ex) 자원을 구별하는 ID는 `/groups/:group_id`
- Client는 URI를 이용해서 자원을 지정하고 해당 자원의 상태(정보)에 대한 조작을 Server에 요청합니다.

#### 행위(Verb): HTTP Method

- REST는 HTTP 프로토콜을 그대로 사용합니다.
- HTTP 프로토콜은 일반적으로 GET, POST, PUT, DELETE 와 같은 메서드를 제공합니다.

| HTTP Method | 역할                                       |
| :---------: | ------------------------------------------ |
|     GET     | 해당하는 자원를 조회합니다.                |
|    POST     | 해당하는 URL를 요청하면 자원를 생성합니다. |
|     PUT     | 해당하는 자원를 수정합니다.                |
|   DELETE    | 해당하는 자원를 삭제합니다.                |

#### 표현(Representation of Resource)

- Client가 자원의 상태(정보)에 대한 조작을 요청하면 Server는 이에 적절한 응답(Representation)을 보낸다.
- REST에서 하나의 자원은 JSON, XML, TEXT, RSS 등 여러 형태의 Representation으로 나타내어 질 수 있다.
- JSON 혹은 XML를 통해 데이터를 주고 받는 것이 일반적이다.

### REST의 특징

#### 1) Server-Client(서버-클라이언트 구조)

- 자원이 있는 쪽이 Server, 자원을 요청하는 쪽이 Client가 된다.
- 서로 간 의존성이 줄어든다.

#### 2) Stateless(무상태)

- HTTP 프로토콜은 Stateless Protocol이므로 REST 역시 무상태성을 갖는다.
- Client의 context를 Server에 저장하지 않는다. 이로 인해 세션과 쿠키와 같은 context 정보를 신경쓰지 않아도 되므로 구현이 단순해진다.
- Server는 각각의 요청을 완전히 별개의 것으로 인식하고 처리합니다.
- 각 API 서버는 Client의 요청만을 단순 처리합니다. 즉, 이전 요청이 다음 요청의 처리에 연관되어서는 안됩니다.(이전 요청이 DB를 수정하여 DB에 의해 바뀌는 것은 허용합니다.)
- Server의 처리 방식에 일관성을 부여하고 부담이 줄어들며, 서비스의 자유도가 높아진다.

#### 3) Cacheable(캐시 처리 가능)

- 웹 표준 HTTP 프로토콜을 그대로 사용하므로 웹에서 사용하는 기존의 인프라를 그대로 활용할 수 있습니다. 이로 인해 HTTP 캐시를 이용하는 등의 동작이 그대로 사용할 수 있습니다.
- 같은 URI에 대한 요청이 여러번 있을 때, URI 리소스를 매번 서버로 요청하지 않고, 클라이언트의 HTTP 캐시에서 미리 가져온 정보를 반환합니다. (전체적인 응답시간, 성능, 서버위 자원 이용율이 향상)

#### 4) Layered System(계층화)

- Client는 REST API Server만 호출합니다.
- REST Server는 다중 계층(Multi-layer)으로 구성될 수 있습니다.
  - API Server는 순수 비즈니스 로직을 수행하고 그 앞단에 보안, 로드밸런싱, 암호화, 사용자 인증 등을 추가하여 구조상의 유연성을 줄 수 있습니다.
  - 또한 로드밸런싱, 공유 캐시 등을 통해 확장성과 보안성을 향상시킬 수 있습니다.
- PROXY, 게이트웨이 같은 네트워크 기반의 중간 매체를 사용할 수 있습니다

#### 5) Code-On-Demand(optional)

- Server로부터 스크립트를 받아서 Client에서 실행할 수도 있습니다.

#### 6) Uniform Interface(인터페이스 일관성)

- URI로 지정한 자원에 대한 조작을 통일되고 한정적인 인터페이스로 수행합니다.
- HTTP 표준 프로토콜에 따르는 모든 플랫폼에서 사용이 가능합니다.
- 특정 언어나 기술에 종속되지 않습니다.

### REST의 장단점

#### 장점

- HTTP 프로토콜의 인프라를 그대로 사용하므로 REST API 사용을 위한 별도의 인프라를 구출할 필요가 없습니다.
- HTTP 프로토콜의 표준을 최대한 활용하여 여러 추가적인 장점을 함께 가져갈 수 있게 해줍니다.
- HTTP 표준 프로토콜에 따르는 모든 플랫폼에서 사용이 가능합니다.
- Hypermedia API의 기본을 충실히 지키면서 범용성을 보장합니다.
- REST API 메시지가 의도하는 바를 명확하게 나타내므로 의도하는 바를 쉽게 파악할 수 있습니다.
- 여러가지 서비스 디자인에서 생길 수 있는 문제를 최소화합니다.
- 서버와 클라이언트의 역할을 명확하게 분리합니다.

#### 단점

- 표준이 존재하지 않습니다.
- 사용할 수 있는 메소드가 4가지 밖에 없습니다.(HTTP Method 형태가 제한적)
- 브라우저를 통해 테스트할 일이 많은 서비스라면 쉽게 고칠 수 있는 URL보다 Header 값이 왠지 더 어렵게 느낄 수 있습니다.
- 구형 브라우저가 아직 제대로 지원해주지 못하는 부분이 존재합니다.
  - PUT, DELETE를 사용하지 못하는 점
  - pushState를 지원하지 않는 점

## 2. REST API

### API(Application Programming Interface)

- 데이터와 기능의 집합을 제공하여 컴퓨터 프로그램간 상호작용을 촉진하며, 서로 정보를 교환가능하도록 하는 것을 말합니다.

### REST API 정의

- REST 기반으로 API를 구현한 것을 말합니다.

### REST API 기본 설계 규칙

#### ※ 리소스 원형

```text
도큐먼트 : 객체 인스턴스나 데이터베이스 레코드와 유사한 개념
컬렉션 : 서버에서 관리하는 디렉터리라는 리소스
스토어 : 클라이언트에서 관리하는 리소스 저장소
```

#### 1) URI는 정보의 자원을 표현해야 합니다

- 자원은 동사보다는 명사를, 대문자보다는 소문자를 사용합니다.
- 자원의 도큐먼트 이름으로는 단수 명사를 사용해야 합니다.
- 자원의 컬렉션 이름으로는 복수 명사를 사용해야 합니다.
- 자원의 스토어 이름으로는 복수 명사를 사용해야 합니다.

```bash
GET /Member/1 -> GET /members/1
```

#### 2) 자원에 대한 행위는 HTTP Method(GET, PUT, POST, DELETE 등)로 표현합니다.

- URI에 HTTP Method 내용이 들어가면 안됩니다.

```bash
GET /members/delete/1 (x) -> DELETE /members/1 (o)
```

- URI에 행위에 대한 동사 표현이 들어가면 안된다.(즉, CRUD 기능을 나타내는 것은 URI에 사용하지 않는다.)

```bash
GET /members/show/1 (x) -> GET /members/1 (o)
```

```bash
GET /members/insert/2 (x) -> POST /members/2 (o)
```

- 경로 부분 중 변하는 부분은 유일한 값으로 대체한다.(예를 들어 :id는 하나의 특정 자원를 나타내는 고유값이다.)

ex) student를 생성하는 route

```bash
POST /students
```

ex) id=12인 student를 삭제하는 route

```bash
DELETE /students/12
```

### REST API 설계 시 유의할 점

#### 1) 슬래시 구분자(/ )는 계층 관계를 나타내는데 사용한다

```bash
http://restapi.example.com/houses/apartments
```

#### 2) URI 마지막 문자로 슬래시( / )를 포함하지 않는다

- URI에 포함되는 모든 글자는 리소스의 유일한 식별자로 사용되어야 하며 URI가 다르다는 것은 리소스가 다르다는 것이고, 역으로 리소스가 다르면 URI도 달라져야 한다.
- REST API는 분명한 URI를 만들어 통신을 해야 하기 때문에 혼동을 주지 않도록 URI 경로의 마지막에는 슬래시(/)를 사용하지 않는다.

```bash
http://restapi.example.com/houses/apartments/ (X)
```

#### 3) 하이픈( - )은 URI 가독성을 높이는데 사용

- 불가피하게 긴 URI경로를 사용하게 된다면 하이픈을 사용해 가독성을 높인다.

#### 4) 밑줄(\_ )은 URI에 사용하지 않는다.

- 밑줄은 보기 어렵거나 밑줄 때문에 문자가 가려지기도 하므로 가독성을 위해 밑줄은 사용하지 않는다.

#### 5) URI 경로에는 소문자가 적합하다

- URI 경로에 대문자 사용은 피하도록 한다.
- RFC 3986(URI 문법 형식)은 URI 스키마와 호스트를 제외하고는 대소문자를 구별하도록 규정하기 때문

#### 6) 파일확장자는 URI에 포함하지 않는다.

- REST API에서는 메시지 바디 내용의 포맷을 나타내기 위한 파일 확장자를 URI 안에 포함시키지 않는다.
- Accept header를 사용한다.

```bash
http://restapi.example.com/members/soccer/345/photo.jpg (X)
GET / members/soccer/345/photo HTTP/1.1 Host: restapi.example.com Accept: image/jpg (O)
```

#### 7) 리소스 간에는 연관 관계가 있는 경우

- /리소스명/리소스 ID/관계가 있는 다른 리소스명

ex) 일반적으로 소유 ‘has’의 관계를 표현할 때

```bash
Ex) GET : /users/{userid}/devices
```

#### ※ HTML 상태 코드

잘 설계된 REST API는 URI만 잘 설계된 것 뿐만 아니라 그 리소스에 대한 응답을 잘 전달하는 것까지 포함되어야 합니다. 정확한 응답의 상태코드만으로도 많은 정보를 전달할 수가 있기 때문에 응답의 상태코드 값을 명확히 돌려주는 것은 생각보다 중요한 일이 될 수도 있습니다. </br>혹시 200이나 4XX관련 특정 코드 정도만 사용하고 있다면 처리 상태에 대한 좀 더 명확한 상태코드 값을 사용할 수 있기를 권장하는 바입니다.</br>
여기서는 간단하게 몇가지만 알아보도록 하겠습니다.

| 상태코드 | 설명                                                                                                     |
| :------: | :------------------------------------------------------------------------------------------------------- |
|   200    | 클라이언트의 요청을 정상적으로 수행함                                                                    |
|   201    | 클라이언트가 어떠한 리소스 생성을 요청, 해당 리소스가 성공적으로 생성됨(POST를 통한 리소스 생성 작업 시) |

| 상태코드 | 설명                                                                                              |
| :------: | :------------------------------------------------------------------------------------------------ |
|   400    | 클라이언트의 요청이 부적절 할 경우 사용하는 응답 코드                                             |
|   401    | 클라이언트가 인증되지 않은 상태에서 보호된 리소스를 요청했을 때 사용하는 응답 코드                |
|          | (로그인 하지 않은 유저가 로그인 했을 때, 요청 가능한 리소스를 요청했을 때)                        |
|   403    | 유저 인증상태와 관계 없이 응답하고 싶지 않은 리소스를 클라이언트가 요청했을 때 사용하는 응답 코드 |
|          | (403 보다는 400이나 404를 사용할 것을 권고. 403 자체가 리소스가 존재한다는 뜻이기 때문에)         |
|   405    | 클라이언트가 요청한 리소스에서는 사용 불가능한 Method를 이용했을 경우 사용하는 응답 코드          |

| 상태코드 | 설명                                                                      |
| -------- | ------------------------------------------------------------------------- |
| 301      | 클라이언트가 요청한 리소스에 대한 URI가 변경 되었을 때 사용하는 응답 코드 |
|          | (응답 시 Location header에 변경된 URI를 적어 줘야 합니다.)                |
| 500      | 서버에 문제가 있을 경우 사용하는 응답 코드                                |

## 3. Restful이란?

- RESTful은 일반적으로 REST라는 아키텍처를 구현하는 웹 서비스를 나타내기 위해 사용되는 용어이다.
- ‘REST API’를 제공하는 웹 서비스를 ‘RESTful’하다고 할 수 있다.</br>
  RESTful은 REST를 REST답게 쓰기 위한 방법으로, 누군가가 공식적으로 발표한 것이 아니다.
  즉, REST 원리를 따르는 시스템은 RESTful이란 용어로 지칭된다.

### RESTful의 목적

- 이해하기 쉽고 사용하기 쉬운 REST API를 만드는 것이 목적입니다.
  - RESTful한 API를 구현하는 근본적인 목적이 성능 향상에 있는 것이 아니라 일관적인 컨벤션을 통한 API의 이해도 및 호환성을 높이는 것이 주 동기이니, 성능이 중요한 상황에서는 굳이 RESTful한 API를 구현할 필요는 없다고 생각합니다.

### RESTful 하지 못한 경우

- CRUD 기능을 모두 POST로만 처리하는 API
- route에 resource, id 외의 정보가 들어가는 경우(/students/updateName)

### Todo 앱을 예시로 보여주는 Restful API 구현

| endpoint (URI)          | 기능                        |
| :---------------------- | :-------------------------- |
| GET /todos              | List all todos              |
| POST /todos             | Create a new todo           |
| GET /todos/:id          | Get a todo                  |
| PUT /todos/:id          | Update a todo               |
| DELETE /todos/:id       | Delete a todo and its items |
| GET /todos/:id/items    | Get a todo item             |
| PUT /todos/:id/items    | Update a todo item          |
| DELETE /todos/:id/items | Delete a todo item          |

## 참조문서

<https://gmlwjd9405.github.io/2018/09/21/rest-and-restful.html>

<http://blog.naver.com/PostView.nhn?blogId=complusblog&logNo=220986337770>

<https://poiemaweb.com/js-rest-api>

<https://meetup.toast.com/posts/92>

<https://brainbackdoor.tistory.com/53>
