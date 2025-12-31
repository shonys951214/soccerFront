# 조기축구 팀 관리 시스템 - 프론트엔드

## 프로젝트 개요

조기축구 팀 관리를 위한 Next.js 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Backend API**: https://soccerportfolio.onrender.com

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_API_URL=https://soccerportfolio.onrender.com
NEXT_PUBLIC_ENV=development
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
soccer-front/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (dashboard)/       # 대시보드 관련 페이지
│   └── layout.tsx        # 루트 레이아웃
├── components/            # React 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   ├── auth/            # 인증 컴포넌트
│   ├── dashboard/        # 대시보드 컴포넌트
│   ├── matches/          # 경기 관련 컴포넌트
│   ├── rankings/         # 랭킹 컴포넌트
│   └── team/             # 팀 관련 컴포넌트
├── lib/                  # 유틸리티 및 설정
│   ├── api/             # API 클라이언트
│   ├── hooks/           # 커스텀 훅
│   ├── types/           # TypeScript 타입 정의
│   └── utils/           # 유틸리티 함수
└── public/              # 정적 파일
```

## 개발 원칙

1. **컴포넌트화**: 모든 UI 요소를 재사용 가능한 컴포넌트로 분리
2. **가독성**: 명확한 변수명, 함수명, 주석 사용
3. **리팩토링**: 코드 중복 최소화, DRY 원칙 준수
4. **깔끔한 page.tsx**: page.tsx는 최소한의 로직만 포함, 대부분의 로직은 컴포넌트로 분리
5. **타입 안정성**: TypeScript를 적극 활용하여 타입 안정성 확보

## 주요 기능

- [x] 프로젝트 초기 설정
- [x] 인증 시스템 기본 구조
- [ ] 로그인/회원가입 페이지
- [ ] 회원 정보 등록
- [ ] 클럽 생성/가입
- [ ] 대시보드 (요약 탭)
- [ ] 경기 관리
- [ ] 참석 투표 시스템
- [ ] 개인 랭크
- [ ] 팀 구성

## API 연동

백엔드 API는 `https://soccerportfolio.onrender.com`에서 제공됩니다.

모든 API 호출은 `lib/api/` 디렉토리에 모듈화되어 있습니다.
