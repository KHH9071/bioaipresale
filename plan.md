## 0) 제품 한 줄 정의

**Bio AI Presales Demo Console**

제약/바이오 고객의 주제(질환/타깃/약물/업무 과제)를 입력하면, 공개 데이터 기반 근거를 탐색하고, 그 결과를 바탕으로 **고객 Pain Point, 적합한 AI 적용 방식, PoC 범위, KPI, 참조 아키텍처**를 제안하는 Presales 데모 웹앱.

---

## 1) 제품 목적과 평가 기준

이 데모는 아래 5가지를 증명해야 한다.

1. **도메인 문맥을 이해한다**
2. **데이터 근거를 빠르게 수집할 수 있다**
3. **고객 과제를 AI 문제로 번역할 수 있다**
4. **PoC를 과도하지 않게 자를 수 있다**
5. **아키텍처/딜리버리 관점으로 설명할 수 있다**

이 5개가 안 보이면 실패다.

예쁜 UI, 복잡한 챗봇, fancy animation은 가치가 낮다.

---

# 2) 전체 화면 구조

### 화면 구성

1. Executive Overview
2. Evidence Explorer
3. Trial Landscape
4. Opportunity & PoC Designer
5. Reference Architecture

### 전역 입력값

- 질환명
- 타깃/바이오마커
- 약물명 또는 modality
- 고객 과제 유형
- 지역(선택)
- 최근 n년(기본 5년)

### 전역 출력 컨셉

모든 화면은 같은 입력값을 공유하고, 각 화면이 아래 질문에 답해야 한다.

- 이 주제가 무엇인가?
- 어떤 근거가 있는가?
- 고객에게 무슨 문제로 연결되는가?
- 어떤 AI 방식이 적합한가?
- 어디까지 PoC로 자를 것인가?

---

# 3) 화면별 상세 기능 명세

---

## 화면 1. Executive Overview

### 목적

사용자 입력을 **고객 문제 정의 문장**으로 바꾸고, 이후 분석의 방향을 정한다.

즉, 검색 시작 화면이 아니라 **Presales 브리핑 화면**이어야 한다.

### 입력 필드

- **Disease / Indication**: 자유 입력
- **Target / Biomarker**: 자유 입력
- **Drug / Modality**: 자유 입력
- **Business Objective**: 드롭다운
    - Literature intelligence
    - Trial scouting
    - Label / regulatory intelligence
    - Scientific Q&A
    - KOL / sponsor landscape
- **Region**: Global / US / KR / EU
- **Time Window**: 최근 3년 / 5년 / 10년

### 주요 출력

1. **One-line Opportunity Statement**
    - 예:
        
        “폐암 관련 scientific evidence와 임상 동향을 통합 탐색하여, 연구자/사업개발 조직의 정보 탐색 시간을 줄이는 Bio AI PoC 기회가 존재합니다.”
        
2. **Likely Customer Pain Points** 3개
    - 정보가 분산되어 있음
    - 문헌/임상 탐색에 수작업 시간이 큼
    - 최신 evidence를 일관되게 요약하기 어려움
3. **Recommended PoC Type** 1개
    - 예: Scientific Evidence RAG
    - 예: Trial Landscape Assistant
    - 예: Label Intelligence Search
4. **Expected KPI Preview** 3개
    - 검색 시간 단축
    - relevant evidence precision 향상
    - 내부 검토용 브리핑 초안 생성 시간 단축

### 내부 로직

- 입력값 기반으로 룰 템플릿 매핑
- 질환/타깃/약물 조합이 비어 있으면 최소한 disease만으로 작동
- Business Objective에 따라 Pain Point, PoC Type, KPI 문구 템플릿이 달라짐

### 화면 카피 초안

- 상단 타이틀: **Executive Overview**
- 서브카피:
    
    **“From Bio Question to AI Presales Opportunity”**
    
- 안내 문구:
    
    “이 데모는 공개 데이터를 기반으로 고객 과제를 구조화하고 PoC 방향을 제안합니다. 의료적 판단이나 치료 권고를 제공하지 않습니다.”
    

### 성공 조건

- 입력 후 3초 이내에 요약 카드 생성
- 사용자가 첫 화면만 봐도 이 앱의 정체를 이해해야 함
- “검색기”가 아니라 “제안 콘솔”처럼 보여야 함

### 실패 패턴

- 그냥 입력폼 + 버튼 구조
- 결과가 너무 일반적이라 모든 질환에 똑같아 보이는 것
- Pain Point가 고객 맥락 없이 공허한 것

---

## 화면 2. Evidence Explorer

### 목적

도메인 근거를 확보한다.

하지만 본질은 논문 나열이 아니다. **Presales용 evidence pack**처럼 보여야 한다.

### 데이터 소스

- PubMed / NCBI Entrez
- 필요 시 키워드 기반 간단 전처리

### 입력/필터

- Query 자동 생성:
    - disease + target
    - disease + drug
    - disease + biomarker
- 정렬:
    - 최신순
    - relevance 추정
- 필터:
    - Review only
    - Recent 1y / 3y / 5y
    - Abstract available

### 주요 출력

1. **Top Papers Table**
    - 제목
    - 연도
    - 저널
    - PMID 링크
    - abstract snippet
2. **Key Terms / Theme Chips**
    - 빈도 높은 키워드
    - 예: resistance, biomarker, efficacy, pathway, mutation
3. **Evidence Summary Box**
    - 최근 연구 흐름 요약
    - 주요 theme 3개
    - 잠재 고객 과제 연결 1문장
4. **Presales Interpretation Box**
    - 예:
        
        “문헌이 빠르게 누적되고 용어가 분산되어 있어, 연구자 대상 evidence retrieval assistant PoC가 적합합니다.”
        

### 내부 로직

- PubMed 검색 결과 상위 N개 조회
- title/abstract 기반 단순 키워드 추출
- LLM이 없어도 룰 기반 요약 가능
- LLM을 쓰더라도 “가공자”이지 “사실 생성자”가 되면 안 됨

### 화면 카피 초안

- 타이틀: **Evidence Explorer**
- 서브카피:
    
    **“Search, cluster, and translate literature into sales-ready insights”**
    

### 성공 조건

- 최소 10개 문헌 결과
- 각 결과는 출처 링크 포함
- 문헌 요약이 **고객 과제 연결 문장**으로 마무리돼야 함

### 실패 패턴

- 그냥 PubMed 복붙 뷰어
- abstract만 길게 보여주고 의미 해석이 없음
- 출처 없는 요약

---

## 화면 3. Trial Landscape

### 목적

시장/임상 관점을 추가한다.

이 화면이 있어야 네가 **R&D만 보는 사람이 아니라 사업개발 감각도 있다**는 인상을 준다.

### 데이터 소스

- ClinicalTrials.gov API

### 입력/필터

- disease / target / drug 기반 질의
- 상태 필터:
    - Recruiting
    - Active
    - Completed
- 단계 필터:
    - Phase 1 / 2 / 3 / 4
- sponsor type:
    - Industry / Academic / NIH 등

### 주요 출력

1. **Trial Summary Cards**
    - 총 trial 수
    - active trial 수
    - recruiting trial 수
    - top sponsor 수
2. **Phase Distribution Chart**
    - phase별 건수
3. **Sponsor Table**
    - sponsor명
    - trial 수
    - 대표 condition
4. **Trial List**
    - NCT ID
    - title
    - phase
    - status
    - sponsor
    - location
5. **Presales Interpretation Box**
    - 예:
        
        “임상 activity가 높은 영역으로, trial scouting 및 sponsor intelligence use case의 우선순위가 높습니다.”
        

### 내부 로직

- 검색 결과 집계
- sponsor 빈도 계산
- phase/status 분포 계산
- 결과가 너무 적으면 “evidence-rich use case 아님” 경고

### 화면 카피 초안

- 타이틀: **Trial Landscape**
- 서브카피:
    
    **“Turn fragmented trial signals into business-readable landscape”**
    

### 성공 조건

- 차트 1개 + 표 1개 + 해석 카드 1개
- 숫자보다 **사업개발적 의미**를 붙여야 함

### 실패 패턴

- 차트만 있고 해석이 없음
- 임상 데이터가 적은 주제에도 무조건 의미 있는 것처럼 포장
- sponsor 분석 없이 단순 trial 목록만 보여줌

---

## 화면 4. Opportunity & PoC Designer

### 목적

이 앱의 본체.

여기서 **검색 결과를 기술 제안서 구조**로 바꾼다.

### 입력

앞선 화면 결과를 자동 참조

추가 선택값:

- Primary User
    - Research scientist
    - Medical affairs
    - BD / strategy
    - Regulatory / labeling
- Existing Data Availability
    - Low / Medium / High
- Delivery Preference
    - Fast PoC
    - Reusable platform
    - Executive demo

### 주요 출력

1. **Problem Definition**
    - 고객이 현재 겪는 문제 2~3줄
2. **Why AI / Why Now**
    - AI가 유효한 이유
    - 지금 해야 하는 이유
3. **Recommended Solution Pattern**
    - Scientific RAG
    - Trial intelligence dashboard
    - Label search assistant
    - Hybrid retrieval + summarization
4. **Data Needed**
    - 공개 데이터
    - 고객 내부 문서
    - SOP/라벨/논문 PDF 등
    - 이후 확장 데이터
5. **6-Week PoC Scope**
    - Week 1: 요구사항 정리 / 데이터 범위 확정
    - Week 2: ingestion / indexing
    - Week 3: retrieval baseline
    - Week 4: summarization / UI
    - Week 5: SME review
    - Week 6: KPI validation / demo
6. **Success KPI**
    - 검색 시간 감소
    - relevance precision
    - 사용자 만족도
    - 내부 검토용 초안 생성 시간
7. **Key Risks & Guardrails**
    - 최신성 부족
    - 환각
    - 출처 불명확
    - 의료 판단 오인
    - 내부 보안 이슈

### 내부 로직

룰 기반 매핑이 핵심이다.

예시:

- objective가 literature intelligence면
    
    → solution pattern = Scientific RAG
    
    → KPI = retrieval precision, answer traceability
    
- objective가 trial scouting이면
    
    → solution pattern = trial intelligence dashboard
    
    → KPI = scouting time reduction, sponsor discovery coverage
    

### 화면 카피 초안

- 타이틀: **Opportunity & PoC Designer**
- 서브카피:
    
    **“Translate evidence into a deployable pre-sales proposal”**
    

### 성공 조건

- 이 화면만 PDF 캡처해도 제안서 한 장처럼 보여야 한다
- 결과가 질환/목적별로 달라져야 한다
- 리스크와 가드레일이 반드시 포함돼야 한다

### 실패 패턴

- “AI로 효율화 가능합니다” 수준의 공허한 문장
- PoC 범위가 과도하게 넓음
- KPI가 측정 불가능

---

## 화면 5. Reference Architecture

### 목적

공고와 직접 맞닿는 화면.

“기술 제안/아키텍처 설계”의 정체성을 보여준다.

### 주요 출력

1. **Architecture Blocks**
    - External Public Data
    - Customer Internal Content
    - Ingestion / ETL
    - Metadata normalization
    - Search index / vector store
    - LLM orchestration
    - Guardrail / citation engine
    - Web app / user layer
    - Logging / evaluation
2. **Deployment Option Cards**
    - Fast PoC on Cloud
    - Enterprise-ready secure deployment
    - Hybrid data access option
3. **Governance Notes**
    - source traceability
    - human review
    - access control
    - non-diagnostic disclaimer
4. **Delivery Notes**
    - PoC 범위
    - production 전환 시 추가 고려사항
    - 예상 확장 모듈

### 표현 방식

- 다이어그램 이미지 또는 block UI
- 사용자가 hover하면 설명 툴팁
- “왜 이 구조가 필요한가” 짧은 설명

### 화면 카피 초안

- 타이틀: **Reference Architecture**
- 서브카피:
    
    **“A cloud-ready pattern for Bio AI evidence and proposal workflows”**
    

### 성공 조건

- 복잡한 클라우드 서비스 나열보다 **흐름 설명**이 우선
- 면접에서 이 화면 켜놓고 3분 설명 가능해야 함

### 실패 패턴

- AWS/GCP/Azure 서비스 이름만 잔뜩 박아 넣는 것
- 보안/출처/검증 계층이 빠진 것
- production처럼 과장하는 것

---

# 4) 정보 구조와 사용자 플로우

## 기본 플로우

1. 사용자가 질환/타깃/약물/목적 입력
2. Executive Overview에서 기회 정의 확인
3. Evidence Explorer에서 문헌 근거 확인
4. Trial Landscape에서 임상/시장 activity 확인
5. Opportunity & PoC Designer에서 제안 초안 생성
6. Reference Architecture에서 구현 구조 확인

## 핵심 UX 원칙

- 한 화면에 하나의 메시지
- 표/차트 아래에는 항상 해석 박스
- 모든 결과는 “그래서 고객 제안으로 어떻게 이어지는가”로 끝나야 함

---

# 5) 화면 문구 초안

## 앱 홈 헤더

**Bio AI Presales Demo Console**

**Public evidence to proposal-ready PoC framing**

## 고정 주의 문구

- “This demo is for evidence exploration and pre-sales planning only.”
- “It does not provide medical advice, diagnosis, or treatment recommendations.”

## 버튼 문구

- Analyze Opportunity
- Explore Evidence
- View Trial Signals
- Generate PoC Draft
- Review Architecture

버튼도 중요하다.

“검색”, “조회”보다 **Analyze / Generate / Review**가 맞다.

이 포지션은 browsing이 아니라 framing이기 때문이다.

---

# 6) 데이터/기능 우선순위

## Must Have

- 질환/타깃/목적 입력
- PubMed 결과 조회
- ClinicalTrials.gov 결과 조회
- Pain Point / PoC / KPI 룰 기반 생성
- 참조 아키텍처 화면
- 모든 출력에 disclaimer

## Should Have

- 키워드 chip 추출
- phase 분포 차트
- sponsor 빈도 표
- 결과 export용 간단 텍스트 블록

## Nice to Have

- PDF export
- sample query presets
- 결과 snapshot 저장
- 다크모드

---

# 7) MVP 제외 항목

여기서 욕심내면 망한다. 아래는 이번 버전에서 빼는 게 맞다.

## 제외 1. 챗봇 인터페이스

이건 흔하고 품질 관리가 어렵다.

지금 필요한 건 대화형 신기함이 아니라 **제안 구조의 명확성**이다.

## 제외 2. 로그인/사용자 계정

포트폴리오용 데모에 불필요하다.

## 제외 3. 내부 고객 문서 업로드

보안/문서 파싱/벡터화까지 가면 일정이 터진다.

## 제외 4. AlphaFold/시퀀스 분석 시뮬레이션

네가 그걸 깊게 구현하지 못할 거면 오히려 약점 노출이다.

## 제외 5. 실제 의료적 추천 기능

불필요하고 위험하다.

## 제외 6. 복잡한 멀티클라우드 선택 UI

아키텍처 설명은 필요하지만, 클라우드 옵션 비교 제품처럼 만들 필요 없다.

---

# 8) 개발 관점의 컴포넌트 쪼개기

## 공통 컴포넌트

- QueryInputPanel
- SummaryCard
- InterpretationBox
- SectionHeader
- DisclaimerBanner

## 데이터 컴포넌트

- PubMedResultsTable
- KeywordClusterChips
- TrialSummaryCards
- PhaseChart
- SponsorTable

## 제안 컴포넌트

- PainPointCard
- PoCScopeTimeline
- KPIList
- RiskGuardrailBox
- ArchitectureDiagram

이렇게 쪼개야 나중에 포트폴리오 문서 캡처도 일관성 있게 나온다.

---

# 9) QA 체크리스트

개발 후 아래 질문에 전부 “예”가 나와야 한다.

1. 첫 화면만 봐도 이 앱의 목적이 명확한가?
2. 검색 결과가 단순 나열이 아니라 해석으로 이어지는가?
3. PoC 제안이 질환/목적에 따라 달라지는가?
4. KPI가 측정 가능한가?
5. 의료적 오해를 피하는 문구가 있는가?
6. 아키텍처가 실제 Presales 설명용으로 쓸 만한가?
7. 화면 캡처만으로도 포트폴리오 PDF를 만들 수 있는가?

하나라도 아니면 다시 손봐야 한다.