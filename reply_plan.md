[ASSUMPTION]

[ASSUMPTION] 지금 필요한 판단은 “이 plan으로 바로 가도 되는가”이지, 문서 품질 평가가 아니다.

[ASSUMPTION] 목표는 **포트폴리오용 데모를 빠르게 안정적으로 완성**하는 것이다.

[ASSUMPTION] 따라서 기준은 “기술적으로 세련됐는가”보다 **일정 리스크를 줄이면서 Presales 메시지를 살리는가**다.

[Core Reasoning]

전체 평가는 이렇다.

**방향은 맞다. 그런데 그대로 가면 2~3군데에서 일정이 멈출 가능성이 크다.**

좋은 점은 분명하다. 5개 화면 구조를 유지했고, Next.js + API Routes + 룰 엔진 + 공유 상태라는 뼈대가 일관적이다. 특히 `objective → pain point / PoC type / KPI` 매핑을 별도 룰 엔진으로 뺀 점, PubMed와 ClinicalTrials.gov를 실제 API로 연결한 점, 마지막에 QA 체크리스트까지 둔 점은 제대로 잡았다. 즉, 이 문서는 “예쁜 앱”이 아니라 **Presales 데모 콘솔**을 만들겠다는 의도가 살아 있다. 
BioAIpresales demo console_2603…

하지만 핵심 문제도 명확하다.

이 plan은 겉으로는 MVP처럼 보이지만, 실제로는 **기술 리스크가 큰 부분이 앞단에 숨어 있다.** 가장 위험한 건 PubMed 처리 방식이다. `esearch → efetch → XML → 정규식 파싱`은 실패 확률이 높다. XML을 정규식으로 처리하면 예외 케이스 하나만 나와도 바로 깨진다. 이건 “나중에 다듬을 부분”이 아니라 **지금 당장 바꿔야 하는 구조적 결함**이다. 그리고 ClinicalTrials.gov 응답 정규화, 전역 상태에 API 데이터까지 넣는 설계, 5개 화면을 모두 구현한 뒤에야 품질 검증하는 순서도 일정상 불리하다. 
BioAIpresales demo console_2603…

내 판단은 단순하다.

**이 plan은 버릴 필요는 없고, 4가지만 수정한 뒤 진행해야 한다.**

첫째, **PubMed XML 파싱 방식을 교체해야 한다.**

정규식 파싱은 빼고 XML 파서 라이브러리를 쓰는 게 맞다. 이 한 줄 수정이 아니라, plan의 “Critical Files” 수준에서 바꿔야 한다. 지금 구조에서 가장 먼저 깨질 가능성이 높은 부분이 여기다. “API가 연결되면 된다”가 아니라 **API 응답이 흔들려도 견딜 수 있어야 한다**가 기준이어야 한다. 
BioAIpresales demo console_2603…

둘째, **전역 상태 범위를 줄여야 한다.**

현재 문서에서는 `입력값 / 룰 출력값 / API 데이터`를 3레이어로 `query-context`에 넣겠다고 했는데, 이건 초기엔 과하다. 입력값과 룰 출력만 전역으로 두고, API 데이터는 각 화면에서 가져오거나 최소한 페이지 단위 캐시로 두는 편이 낫다. 이유는 간단하다. API 데이터까지 전역에 얹으면 로딩/에러/새로고침/탭 이동이 얽히면서 디버깅 포인트가 급증한다. 포트폴리오 데모에서 가장 피해야 하는 게 **“상태 꼬임”**이다. 
BioAIpresales demo console_2603…

셋째, **구현 순서를 바꿔야 한다.**

지금 문서는 Foundation → Rule Engine → API Routes → Screen 1… 순서다. 논리적으로는 정돈돼 보이지만, 실전에서는 API에서 오래 막힐 수 있다. 더 나은 순서는 이거다.

**Foundation → Screen skeleton → Overview 1차 완성 → Evidence happy path 1개 → Trial happy path 1개 → PoC Designer → Architecture → 나머지 polish**

즉, 세로로 한 줄 뚫는 방식이 맞다. 5개 화면을 전부 틀만 만들고 나중에 데이터를 넣는 방식보다, **샘플 preset 1개가 끝까지 도는 vertical slice**를 먼저 완성해야 한다. 그래야 중간 산출물도 바로 포트폴리오 캡처에 쓸 수 있다. 
BioAIpresales demo console_2603…

넷째, **“데모 안정성” 레이어가 빠져 있다.**

이 문서는 실제 API 연동에는 신경 썼지만, 데모 실패 방지책은 약하다. 반드시 들어가야 할 게 2개다.

하나는 **preset deep link 또는 URL query sync**다. 그래야 특정 시나리오를 바로 재현할 수 있다.

다른 하나는 **fixture/fallback JSON**이다. API가 느리거나 응답이 흔들릴 때도 데모 화면이 살아 있어야 한다. 포트폴리오는 실서비스가 아니라 **면접/제출 상황에서 반드시 재현돼야 하는 물건**이다. 라이브 API만 믿고 가는 건 안일하다. 
BioAIpresales demo console_2603…

추가로, plan에서 잘 잡은 부분도 더 날카롭게 만들 수 있다.

샘플 프리셋 3개를 넣겠다고 했는데, 초기에 3개를 다 잡는 건 분산이다. **대표 시나리오 1개를 먼저 완성**하는 게 맞다. 문서 마지막에도 `"Lung Cancer / KRAS G12C / Sotorasib / Literature Intelligence"`를 end-to-end 테스트 프리셋으로 박아뒀는데, 사실 이게 곧 대표 시나리오다. 그러면 초반 구현도 이 프리셋 하나로 끝까지 맞추는 게 낫다. 나머지 2개 프리셋은 그다음이다. 
BioAIpresales demo console_2603…

[Risks & Blind Spots]

가장 큰 리스크는 세 가지다.

첫째, **문서가 정교해서 구현도 정교할 거라고 착각하는 것**.

아니다. 이 plan은 잘 쓰였지만, 실제 일정은 `API 응답 정규화`, `상태 공유`, `에러 처리`에서 터진다. 특히 PubMed 처리 방식은 방치하면 거의 확실히 디버깅 늪이 된다. 
BioAIpresales demo console_2603…

둘째, **Presales 데모인데 개발 프레임워크 완성도에 에너지를 너무 쓰는 것**.

CSS Modules, 다크 테마, hover 툴팁, skeleton loader는 좋다. 하지만 그건 2차다. 우선순위는

`문제정의 → evidence → trial signal → PoC → architecture`

이 흐름이 실제로 살아나는지다. 화면이 예뻐도 이 흐름이 죽으면 공고 적합성이 떨어진다. 
BioAIpresales demo console_2603…

셋째, **“실제 API 연동”을 곧 포트폴리오 가치라고 착각하는 것**.

아니다. 포트폴리오 가치의 본체는 `룰 기반 해석`과 `PoC framing`이다. API는 근거를 공급하는 장치일 뿐이다. 따라서 Evidence/Trial 화면이 단순 조회로 끝나면 실패다. 반드시 해석 박스와 제안 연결이 살아 있어야 한다. 문서상 의도는 맞는데, 구현 단계에서 여기부터 무너지기 쉽다. 
BioAIpresales demo console_2603…

[Strategic Implications]

이 plan을 약간만 바로잡으면, 결과물의 성격이 달라진다.

지금 상태로 가면 **“의료 데이터 조회가 되는 웹앱”**이 나올 가능성이 있다.

수정 후 가면 **“고객 과제를 AI PoC로 번역하는 Presales 콘솔”**이 된다.

겉보기엔 비슷하지만, 채용 관점에서 완전히 다르다.

특히 `Rule Engine Core`, `5개 objective`, `KPI 정의`, `Verification Checklist`는 이미 좋은 자산이다. 이걸 살리면 너는 단순히 코딩한 사람이 아니라 **문제 정의, 제안 구조화, KPI 설계가 가능한 사람**처럼 보인다. 이게 이 공고에서 필요한 인상이다. 
BioAIpresales demo console_2603…

[Immediate Actions]

내 권고는 명확하다.

**진행은 하되, 먼저 아래 4개를 plan에 반영하고 시작하는 게 맞다.**

1. `PubMed XML 정규식 파싱` → **XML parser 사용**으로 변경
2. `query-context`에서 **API 데이터 제외**, 입력값/룰 출력 중심으로 축소
3. 구현 순서를 **vertical slice 우선**으로 재정렬
4. **URL query sync + fixture fallback** 추가

그다음 기준도 하나로 고정해라.

**첫 완성 목표는 “Lung Cancer / KRAS G12C / Sotorasib / Literature Intelligence” 한 프리셋이 5개 화면에서 끝까지 안정적으로 도는 것**이다. 이게 되면 나머지는 확장이다. 이게 안 되면 지금 문서는 잘 쓴 계획서일 뿐이다.