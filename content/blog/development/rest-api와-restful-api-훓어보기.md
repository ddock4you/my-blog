---
title: REST API와 RESTful API 훓어보기
date: 2020-04-15 18:04:53
category: development
draft: false
---

## REST란?

Representational State Transfe라는 용어의 약자입니다.</br>
HTTP URI로 잘 표현된 리소스(자원)에 대한 행위를 의미합니다.

조금 더 설명을 덧붙이자면 여기서 말하는 리소스(자원)는 문서, 그림, 각종 데이터가 될 수 있으며 각 자원마다 고유한 ID인 HTTP URI를 통해 자원을 명시합니다.
그리고 HTTP Method를 통해 어떤 행동을 할지 정해주고 결과를 받을 수 있는 것을 말합니다.

<!-- 자원, 행위, 표현 3가지로 나눠서 좀 더 세부적으로 표현할 예정 -->

### HTTP Method

REST에서는 리소스(자원)에 대한 행위가 일관되게 정의됩니다. REST로 다루는 리소스(자원)이 어떤 것이든 상관없이 같은 메서드에 의해 다뤄집니다.
HTTP Method는 REST에서 기본적으로 5가지가 가장 일반적으로 사용되며 기본적인 데이터 처리 방식인 CRUD를 만족하고 있습니다.

Method: POST, GET, PUT, PATCH, DELETE
CRUD:

POST / Create : 지정된 URI에 새로운 리소스를 생성
GET / Read : 지정된 URI에서 리소스를 검색하고 이를 반환
PUT / Update / Replace : 지정된 URI에 리소스를 만들거나 대체
PATCH / Update / Modify : 지정된 URI에 존재하는 리소스의 일부를 업데이트 또는 수정
DELETE / Delete : 지정된 URI의 리소스 제거
