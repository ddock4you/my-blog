---
title: 'HTTP 알아보기'
date: 2020-5-26 22:00:13
category: 'development'
draft: false
---

## HTTP (HyperText Transfer Protocol) 란?

HTTP는 WWW(World Wide Web) 상에서 정보를 주고받을 수 있는 프로토콜입니다.
웹에서는 클라이언트와 서버 간에 데이터를 주고 받기 위한 방식으로 HTTP 프로토콜을 사용하고 있습니다.

클라이언트와 서버들은 개별적인 메시지 교환에 의해 통신합니다. 보통 브라우저인 클라이언트에 의해 전송되는 메시지를 `요청(Request)`이라 부르며, 이에 대해 서버에서 응답으로 전송해주는 메시지를 `응답(Response)`라고 부릅니다.

클라이언트가 HTTP를 통해 서버로부터 웹페이지나 정보를 요청하면 서버는 이 요청에 응답하여 필요한 정보를 클라이언트에게 전달합니다. 그러면 웹 브라우저와 같은 클라이언트는 이를 모니터와 같은 출력 장치를 통해 유저에게 화면을 나타내줍니다.

![HTTP를 통한 요청과 응답 이미지](https://mdn.mozillademos.org/files/13677/Fetching_a_page.png)

## HTTP의 특징

HTTP 프로토콜은 상태가 없는 (`stateless`) 프로토콜입니다. 데이터를 주고 받기 위한 각각의 데이터 요청이 서로 독립적으로 관리가 됩니다. (이전 데이터 요청과 다음 데이터 요청이 서로 관련이 없습니다.)

이러한 특징 덕에 서버는 세션과 같은 별도의 추가 정보를 관리하지 않아도 되고, 다수의 요청 처리 및 서버의 부하를 줄일 수 있는 성능상의 이점이 있습니다.

그러나 일관된 방식으로 사용자가 페이지와 상호작용하길 원할 때 문제가 됩니다.
예를 들어 클라이언트가 과거에 로그인을 성공하더라도 로그인 정보를 유지할 수가 없습니다.
하지만 HTTP는 `쿠키(Cookie)`를 이용하여 상태가 있는 세션을 만들도록 해줍니다.

### 쿠키(Cookie)

쿠키는 클라이언트와 서버의 상태 정보를 담고 있는 정보 조각입니다.
로그인을 예로 들자면, 클라이언트가 로그인에 성공하면, 서버는 로그인 정보를 자신의 데이터베이스에 저장하고 있는 동일한 값을 쿠키 형태로 클라이언트에 내보냅니다.
클라이언트는 다음 번 요청 때 cookie를 서버에 보내는데, 서버는 cookie 값으로 자신의 데이터베이스를 조회해서 로그인 여부를 확인할 수 있습니다. (세션을 유지할 수 있게 됩니다.)

### 세션

서버가 해당 서버로 접근(request)한 클라이언트를 식별하는 방법입니다.

## URI (Uniform Resource Identifiers)

URI는 자원의 위치를 알려주기 위한 프로토콜입니다. HTTP와는 독립된 다른 체계입니다. 클라이언트는 웹상에서 URI를 이용하여 자원(리소스)을 찾습니다. URI의 가장 일반적인 형식은 URL입니다.

### URL (Uniform Resource Locator)

서버의 자원을 요청하기 위해 입력하는 영문주소입니다.
URL 구조는 아래 이미지를 참고합니다.

![URL 구조](./images/url-structure.png)

## HTTP 메서드

메서드는 서버에 요청을 하게 될 때 요청의 종류를 알려주기 위해 사용됩니다.

- **GET**: 자원의 정보를 요청합니다. (SELECT)
- **POST**: 새로운 자원을 생성합니다. (INSERT)
- **PUT**: 자원을 변경합니다. (UPDATE))
- **DELETE**: 자원을 삭제합니다. (DERETE)
- **HEAD**: HTTP 헤더 정보를 요청합니다. GET과 비슷하나 Response Body를 반환하지 않습니다.
- **OPTION**: 서버 옵션들을 확인하기 위해 요청합니다. CORS에서 사용합니다.
- **TRACE**: 클라이언트의 요청을 그대로 반환합니다. 서버 상태를 확인하기 위한 목적으로 주로 사용됩니다.

※ 때에 따라서 POST 메서드로 PUT, DELETE 동작도 수행할 수 있습니다.

## HTTP 메시지

클라이언트가 서버에 어떠한 정보를 요청할 때 요청에 대한 정보를 담아 보냅니다. 반대로 서버가 클라이언트에 응답할 때 응답에 대한 정보를 담아 클라이언트로 보냅니다. 이때 정보가 담긴 메시지를 **HTTP 메시지**라고 합니다.

### HTTP 메시지 구조

HTTP 요청과 응답의 구조는 서로 닮았으며, 그 구조는 아래와 같습니다.

![HTTP 메시지 구조](https://mdn.mozillademos.org/files/13827/HTTPMsgStructure2.png)

1. 시작줄(start-line)에는 실행되어야 할 요청, 또는 요청 수행에 대한 성공 또는 실패가 기록되어 있습니다. 이 줄은 항상 한 줄로 끝납니다.

2. 옵션으로 HTTP 헤더 세트가 들어갑니다. 여기에는 요청에 대한 설명 혹은 메시지 본문에 대한 설명이 들어갑니다.

3. 요청에 대한 모든 메타 정보가 전송되었음을 알리는 빈 줄(blank line)이 삽입됩니다.

4. 요청과 관련 내용(HTML 폼 콘텐츠 등)이 옵션으로 들어가거나, 응답과 관련된 문서(document)가 들어갑니다. 본문의 존재 유무 및 크기는 첫 줄과 HTTP 헤더에 명시됩니다.

### 요청 메시지

```console
GET /hello.txt HTTP/1.1
User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3
Host: www.example.com
Accept-Language: en, mi

(본문없음)
```

#### 시작 줄 (Start line)

```console
GET /hello.txt HTTP/1.1
```

첫번째는 HTTP 메서드가 옵니다. (GET, PUT, POST 등)
두번째로 오는 요청 타겟은 주로 URL, 또는 프로토콜, 포트, 도메인의 절대 경로로 나타낼 수도 있으며 이들은 요청 컨텍스틍 의해 특정지어 집니다.</br>
요청 타겟 포맷은 HTTP 메소드에 따라 달라집니다. </br>
마지막엔 HTTP 버전이 들어갑니다.

#### 헤더 (HEADER)

```console
User-Agent: curl/7.16.3 libcurl/7.16.3 OpenSSL/0.9.7l zlib/1.2.3
Host: www.example.com
Accept-Language: en, mi
```

요청에 들어가는 HTTP 헤더는 HTTP 헤더의 기본 구조를 따릅니다. 대소문자 구분없는 문자열 다음에 콜론(':')이 붙으며, 그 뒤에 오는 값은 헤더에 따라 달라집니다.</br>
다양한 종류의 요청 헤더가 있는데, 이들은 크게 3가지의 그룹으로 나눌 수 있습니다.

- **Request headers**
- **General headers**
- **Entity headers**

![HTTP 메시지 구조](https://mdn.mozillademos.org/files/13821/HTTP_Request_Headers2.png)

#### 본문 (BODY)

본문은 요청의 마지막 부분에 들어갑니다. 모든 요청에 본문이 들어가지는 않습니다. `GET`, `HEAD`, `DELETE`, `OPTIONS`처럼 리소스를 가져오는 요청은 보통 본문이 필요가 없습니다. 일부 요청은 업데이트를 하기 위해 서버에 데이터를 전송합니다. 보통(HTML 폼 데이터를 포함하는) `POST` 요청이 그렇습니다.

본문은 크게 두 가지 종류로 나뉩니다.

- **단일-리소스 본문(single-resource bodies)**: 헤더 두 개(Content-Type와 Content-Length)로 저의된 단일 파일로 구성됩니다.
- **다중-리소스 본문(multipie-resource bodies)**: 멀티파트 본문으로 구성되는 다중 리소스 본문에서는 파트마다 다른 정보를 지니게 됩니다. 보통 HTML 폼과 관련이 있습니다.

### 응답 메시지

```console
HTTP/1.1 200 OK
Date: Mon, 27 Jul 2009 12:28:53 GMT
Server: Apache
Last-Modified: Wed, 22 Jul 2009 19:15:56 GMT
ETag: "34aa387-d-1568eb00"
Accept-Ranges: bytes
Content-Length: 51
Vary: Accept-Encoding
Content-Type: text/plain
```

#### 상태 줄 (Status line)

```console
HTTP/1.1 200 OK
```

HTTP 응답의 시작 줄은 상태 줄(status line)이라고 불립니다.

첫번째는 `프로토콜 버전`이 앞에 나옵니다.
두번째는 `상태 코드`가 나옵니다. 상태코드는 요청의 성공 여부를 숫자로 나타냅니다.
마지막엔 `상태 텍스트`가 나옵니다. 짧고 간결하게 상태 코드에 대한 설명을 글로 나타내어 사람들이 HTTP 메시지를 이해할 때 도움이 됩니다.

#### 헤더 (HEADER)

```console
Date: Mon, 27 Jul 2009 12:28:53 GMT
Server: Apache
Last-Modified: Wed, 22 Jul 2009 19:15:56 GMT
ETag: "34aa387-d-1568eb00"
Accept-Ranges: bytes
Content-Length: 51
Vary: Accept-Encoding
Content-Type: text/plain
```

응답 메시지 헤더와 구조는 같습니다.

- **Request headers**
- **General headers**
- **Entity headers**

![HTTP 메시지 구조](https://mdn.mozillademos.org/files/13823/HTTP_Response_Headers2.png)

#### 본문 (BODY)

본문은 응답의 마지막 부분에 들어갑니다. 모든 응답에 본문이 들어가지는 않습니다. `201`, `204`와 같은 상태 코드를 가진 응답에는 보통 본문이 없습니다.

본문은 크게 세 가지 종류로 나뉩니다.

- 이미 길이가 알려진 단일 파일로 구성된 단일-리소스 본문: 헤더 두개(Content-Type와 Content-Length)로 정의 합니다.
- 길이를 모르는 단일 파일로 구성된 단일-리소스 본문: Transfer-Encoding가 chunked로 설정되어 있으며, 파일은 청크로 나뉘어 인코딩 되어 있습니다.
- 서로 다른 정보를 담고 있는 멀티파트로 이루어진 다중 리소스 본문: 이 경우는 상대적으로 위의 두 경우에 비해 보기 힘듭니다.

## HTTP 상태 코드

HTTP 상태 코드는 서버에서 설정해주는 응답(Response) 정보입니다.
프론트 엔드 개발자는 이 상태 코드로 에러 처리를 할 수 있습니다.

### 2xx 성공

200번대의 상태 코드는 대부분 성공을 의미합니다.

- **200**: GET 요청에 대한 성공
- **204**: No Content. 성공했으나 응답 본문에 데이터가 없음
- **205**: Reset Content. 성공했으나 클라이언트의 화면을 새로 고침하도록 권고
- **206**: Partial Conent. 성공했으나 일부 범위의 데이터만 반환

### 3xx 리다이렉션

300번대의 상태 코드는 대부분 클라이언트가 이전 주소로 데이터를 요청하여 서버에서 새 URL로 유도를 하는 경우입니다. </br>
ex) 로그인을 성공하고 나서 대문 페이지로 보낸다거나, 다운로드 페이지로 보내는 등의 용도

- **301**: Moved Permanently, 요청한 자원이 새 URL에 존재
- **303**: See Other, 요청한 자원이 임시 주소에 존재
- **304**: Not Modified, 요청한 자원이 변경되지 않았으므로 클라이언트에서 캐싱된 자원을 사용하도록 권고. ETag와 같은 정보를 활용하여 변경 여부를 확인

### 4xx 클라이언트 에러

400번대의 대부분 클라이언트의 요청이 잘못된 경우입니다.

- **400**: Bad Request, 잘못된 요청
- **401**: Unauthorized, 권한 없이 요청. Authorization 헤더가 잘못된 경우
- **403**: Forbidden, 서버에서 해당 자원에 대해 접근 금지
- **405**: Method Not Allowed, 허용되지 않은 요청 메서드
- **409**: Conflict, 최신 자원이 아닌데 업데이트하는 경우. ex) 파일 업로드 시 버전 충돌

### 5xx 서버 에러

500번대 상태 코드는 서버 쪽에서 오류가 난 경우입니다.

- **501**: Not Implemented, 요청한 동작에 대해 서버가 수행할 수 없는 경우
- **503**: Service Unavailable, 서버가 과부하 또는 유지 보수로 내려간 경우

## 참조문서

<https://developer.mozilla.org/ko/docs/Web/HTTP/Overview>

<https://developer.mozilla.org/ko/docs/Web/HTTP/Messages>

<https://joshua1988.github.io/web-development/http-part1/>

<https://www.joinc.co.kr/w/Site/Network_Programing/AdvancedComm/HTTP>
