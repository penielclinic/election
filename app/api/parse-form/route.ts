import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contentParts: any[] = [];

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mediaType = file.type;

      if (mediaType === "application/pdf") {
        contentParts.push({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: base64 },
        });
      } else {
        contentParts.push({
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
            data: base64,
          },
        });
      }
    }

    contentParts.push({
      type: "text",
      text: `이 이미지(들)는 교회 항존직 후보 지원 신청서 및/또는 자기점검표입니다.
손으로 기재되거나 체크된 모든 내용을 읽어서 아래 JSON 형식으로 반환하세요.
빈 칸이나 없는 값은 null 또는 "" 로 반환하세요.

규칙:
- position: 성명 옆 직분란에 적힌 값 (장로, 안수집사, 권사 중 하나)
- birthDate/churchRegisterDate/baptismDate/ordinationDate: "YYYY-MM-DD" 또는 "YYYY년 MM월 DD일" 형식 그대로
- worshipSundayMain 등 예배항목: A/B/C/D/E 중 체크된 것 (없으면 "")
- dawnPrayerWeekly: 숫자만 (예: "3")
- tithe: 예에 체크=true, 아니오=false, 미체크=null
- evangelismCount: 숫자 텍스트 (예: "2")
- q1SundayWorship: 선택한 번호의 점수 (①=15, ②=10, ③=5, ④=0)
- q2EveningWorship: 선택한 번호의 점수 (①=10, ②=8, ③=6, ④=3, ⑤=0)
- q3WednesdayPrayer: (①=5, ②=4, ③=3, ④=2, ⑤=0)
- q4FridayPrayer: (①=5, ②=4, ③=3, ④=2, ⑤=0)
- q5DawnPrayer: (①=5, ②=4, ③=3, ④=2, ⑤=0)
- q6SpecialMeeting: (①=5, ②=4, ③=3, ④=2)
- q7SpiritBaptism: ①예=true, ②아니오=false
- q8AlcoholResolved: ①예=true, ②아니오=false
- q9Tithe: (①=15, ②=10, ③=5, ④=4)
- q10Thanksgiving: (①=10, ②=8, ③=6, ④=4)
- q11SeasonalOffering: ①예=true, ②아니오=false
- q12FamilyFaith: ①예=true, ②아니오=false
- q13MinistryCooperation: ①예=true, ②아니오=false
- serviceRecords: 봉사 표에서 체크/표시된 칸만 true (연도별로)
- q2~q5EveningWorshipReason 등 사유란: 체크된 이유 텍스트 그대로

{
  "name": "",
  "position": "",
  "birthDate": "",
  "churchRegisterDate": "",
  "baptismDate": "",
  "baptismChurch": "",
  "officiantPastor": "",
  "ordinationDate": "",
  "ordinationChurch": "",
  "phone": "",
  "email": "",
  "address": "",
  "familyMembers": [
    {"name":"","relationship":"","age":"","church":"","position":""}
  ],
  "careerHistory": [
    {"company":"","position":"","startYear":"","endYear":"","notes":""}
  ],
  "worshipSundayMain": "",
  "worshipSundayDay": "",
  "worshipWednesday": "",
  "worshipFriday": "",
  "worshipMission": "",
  "dawnPrayerWeekly": "",
  "tithe": null,
  "evangelismCount": "",
  "q1SundayWorship": null,
  "q2EveningWorship": null,
  "q2EveningWorshipReason": "",
  "q3WednesdayPrayer": null,
  "q3WednesdayPrayerReason": "",
  "q4FridayPrayer": null,
  "q4FridayPrayerReason": "",
  "q5DawnPrayer": null,
  "q5DawnPrayerReason": "",
  "q6SpecialMeeting": null,
  "q7SpiritBaptism": null,
  "q7SpiritEvidence": "",
  "q8AlcoholResolved": null,
  "q9Tithe": null,
  "q10Thanksgiving": null,
  "q11SeasonalOffering": null,
  "q12FamilyFaith": null,
  "q13MinistryCooperation": null,
  "serviceRecords": {
    "2021": {"교사":false,"찬양대":false,"주차안내":false,"주방봉사":false,"차량봉사":false,"예배안내":false,"새가족":false,"순장":false,"위원회 활동":false,"중보기도":false,"기타봉사":false},
    "2022": {"교사":false,"찬양대":false,"주차안내":false,"주방봉사":false,"차량봉사":false,"예배안내":false,"새가족":false,"순장":false,"위원회 활동":false,"중보기도":false,"기타봉사":false},
    "2023": {"교사":false,"찬양대":false,"주차안내":false,"주방봉사":false,"차량봉사":false,"예배안내":false,"새가족":false,"순장":false,"위원회 활동":false,"중보기도":false,"기타봉사":false},
    "2024": {"교사":false,"찬양대":false,"주차안내":false,"주방봉사":false,"차량봉사":false,"예배안내":false,"새가족":false,"순장":false,"위원회 활동":false,"중보기도":false,"기타봉사":false},
    "2025": {"교사":false,"찬양대":false,"주차안내":false,"주방봉사":false,"차량봉사":false,"예배안내":false,"새가족":false,"순장":false,"위원회 활동":false,"중보기도":false,"기타봉사":false}
  }
}

JSON만 반환하고 다른 설명은 추가하지 마세요.`,
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: contentParts }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "내용을 인식할 수 없습니다. 이미지를 다시 확인해주세요." }, { status: 400 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "처리 중 오류가 발생했습니다.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
