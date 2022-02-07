# 잠이드는 순간 Zzz
- [서비스 주소 링크](https://zzzapp.co.kr)
- [프로젝트 설명 영상 링크](https://www.youtube.com/watch?v=D4G0D7asSYU)

## 1. 프로젝트 소개
쉽게 잠에 들지 못하는 사람들을 위한 서비스 기획
- 매년 불면증으로 증가하는 사람들이 늘고 있습니다.
편안한 수면을 위해선 잠들기 전 심리적인 불안과, 긴장을 풀어주는 것이 필요하다 생각하여
저희는 이런 어려움을 겪는 사람들을 위해 asmr 제공 서비스를 제공하자 하였습니다.
asmr 커스텀도 함께 제공되며, 그 날의 수면 기록을 남길 수 있는 수면 다이어리와 수면 기록 점수를 반영한 수면 점수 통계를 제공해드립니다.
### 개발기간
- 2021.12.18 ~ 2021.01.24
### 팀 구성
- Node.js 김다희 방민수
- React 최수인 김태언 오은희
- Designer 김민혜 김혜진
### 팀 협업
- Github를 이용하여 코드 관리
- Notion, Slack을 이용하여 스케줄 공유 및 회의 진행
- Postman을 이용하여 API 문서 공유
- HTTP 상태 코드를 사용하여 에러 공유
#### API
- [API 문서 링크](https://documenter.getpostman.com/view/18707207/UVXgKwhJ)

## 2. Project Architecture
![슬라이드4](https://user-images.githubusercontent.com/87823892/152728855-ae980301-609a-419d-bfb3-9fd0253a4ed8.PNG)
- 백엔드에서는 기존의 Filezila 사용 시 업로드 시간이 오래걸리고 불편한 부분을 최소화하기 위해 jenkins를 이용하여 불필요한 단계를 간소화 시켰으며, 자동배포로 배포 시간을 줄여 안정성을 높였습니다.
깃허브와 젠킨스는 웹훅으로 연결되어 코드가 푸시되면 젠킨스에서 미리 설정해놓은 스크립트 파일을 실행합니다.
스크립트는 젠킨스에서 ssh로 노드 서버에 연결하여 git pull 그리고 pm2 reload로 자동배포를 구현하였습니다.

## 3. Backend Tech Stacks
|Name|Tech|
|------|---|
|Sever|Node.js  Express|
|Language|Javascript|
|Database|MongoDB|
|CI/CD|Jenkins|

## 4. Library
|Package|Description|
|------|---|
|bcrypt|bcrypt JWT 토큰 암호화|
|body-parser|요청의 본문을 해석해주는 미들웨어|
|cors|CORS 핸들링|
|dotenv|환경변수 핸들링|
|firebase-admin|특정 유저에게 알림 전송|
|fs|SSL 인증서 처리|
|helmet|웹 서비스 보안|
|http|http 내장 모듈|
|https|https 내장 모듈|
|joi|유저 회원가입 시 입력값 유효성 체크|
|jsonwebtoken|로그인 시 JWT 발급|
|moment|날짜 지원 라이브러리|
|mongoose|mongoDB 사용을 위한 노드의 확장 모듈|
|mongoose-auto-increment|고유값 자동 증가|
|morgan|요청 로그 관리|
|node-schedule|특정 시간에 알람 전송|

## 5. 주요기능
### 1. 로그인/회원가입
- 영문 소문자, 숫자,  특수기호를 이용하여 아이디와 비밀번호를 설정할 수 있습니다.
- JWT 방식으로 보안된 다양한 로그인 방식을 제공합니다.
  - 일반 로그인
  - 소셜 로그인(KaKaO)
- 회원가입 시 비밀번호의 보안을 위해 bcrypt 모듈을 사용하였습니다.
### 2. 알림
- Firebase를 통해 특정 유저에게 Push 알림 서비스를 제공합니다.
- Node-schedule을 사용하여 특정 시간 알림 전송을 구현하였습니다.
### 3. ASMR
- ASMR을 커스텀하여 저장 가능합니다.
### 4. 다이어리
- 저번주와 이번주 수면 점수를 기반으로 수면 통계 점수를 알려드립니다.
- 수면 점수 기록으로 수면 상태 파악이 가능합니다.
### 5. 보안
- 비공개 정보를 dotenv 파일로 관리합니다.
- letsencrypt 인증으로 https를 설정하였습니다.
- CORS 사용 시 whirelist 관리로 신뢰 가능한 도메인의 요청만 받습니다.
- helmet을 이용하여 HTTP 헤더 설정을 해제하였습니다.

