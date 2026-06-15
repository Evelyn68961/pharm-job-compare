# 醫院官方招募頁 URL 註冊檔（醫學中心，24 條）

> Hospital career-page URL registry — pharmacist job comparison site.
> Per **§2 governing rule** of `plan/pharmacist-job-compare-plan-v4.md`：
> 本檔所有 URL **必須是醫院自有官方網域**（gov.tw / org.tw /
> ndmctsgh.edu.tw / tmu.edu.tw / tzuchi.com.tw 等）。**禁止任何第三方
> 人力銀行**（104.com.tw / 1111.com.tw / yes123.com.tw / cake.me /
> indeed.com / linkedin.com）出現在 `career_page_url` 欄位。
>
> Schema per **§11 URL registry** of v4 plan. 機器鏡像位於本檔末段
> ```json``` 區塊，最終會由 `scripts/build-url-registry.py` 產生獨立
> 的 `hospital-career-urls.json`。
>
> **資料範圍**：23 家醫學中心（113 年度評鑑後），含 22 家綜合 +
> 2 家兒童醫院 = **24 條**（兒童醫院獨立列入）。
>
> 最近建檔/驗證：**2026-05-23**

---

## 一、表格（人類可讀）

| hospital_id | name | tier | region | city | career_page_url | verified_date |
|---|---|---|---|---|---|---|
| ntuh-main | 臺大醫院 | 醫學中心 | 北北基 | 臺北市 | https://www.ntuh.gov.tw/ntuh/Recruit.action?muid=46 | 2026-05-23 |
| vghtpe-main | 臺北榮民總醫院 | 醫學中心 | 北北基 | 臺北市 | https://www4.vghtpe.gov.tw/conscribe/indexb.htm | 2026-05-23 |
| tsgh-main | 三軍總醫院 | 醫學中心 | 北北基 | 臺北市 | https://www1.ndmctsgh.edu.tw/RessourceHumaine/HirP01.aspx | 2026-05-23 |
| mmh-taipei | 馬偕紀念醫院 | 醫學中心 | 北北基 | 臺北市 | https://www.mmh.org.tw/hr/stafflist.php | 2026-05-23 |
| cgh-main | 國泰綜合醫院 | 醫學中心 | 北北基 | 臺北市 | https://www.cgh.org.tw/ec99/rwd1320/category.asp?category_id=135 | 2026-05-23 |
| skh-main | 新光吳火獅紀念醫院 | 醫學中心 | 北北基 | 臺北市 | https://recruitweb.skh.org.tw/Recruit/JobVacancyResume/List | 2026-05-23 |
| wanfang-main | 萬芳醫院 | 醫學中心 | 北北基 | 臺北市 | https://www.wanfang.gov.tw/departments/WanfangClass_48/7f6ca32cdb8b7c0a | 2026-05-23 |
| cgmh-linkou | 林口長庚紀念醫院 | 醫學中心 | 桃竹苗 | 桃園市 | https://www.cgmh.org.tw/tw/Systems/Recruit | 2026-05-23 |
| femh-main | 亞東紀念醫院 | 醫學中心 | 北北基 | 新北市 | https://www.femh.org.tw/mainpage/femhjob | 2026-05-23 |
| tzuchi-taipei | 臺北慈濟醫院 | 醫學中心 | 北北基 | 新北市 | https://taipei.tzuchi.com.tw/%E8%97%A5%E5%B8%AB%E5%8F%AC%E5%8B%9F/ | 2026-05-23 |
| shh-main | 衛福部雙和醫院 | 醫學中心 | 北北基 | 新北市 | https://shh.tmu.edu.tw/page/WelfareRecruited.aspx | 2026-05-23 |
| vghtc-main | 臺中榮民總醫院 | 醫學中心 | 中彰投 | 臺中市 | https://www.vghtc.gov.tw/Module/RecruitMent?WebMenuID=9d005e46-411b-46fc-b438-e0bd561eba78 | 2026-05-23 |
| cmuh-main | 中國醫藥大學附設醫院 | 醫學中心 | 中彰投 | 臺中市 | https://www.cmuh.org.tw/CMUHPages/Careers | 2026-05-23 |
| csh-main | 中山醫學大學附設醫院 | 醫學中心 | 中彰投 | 臺中市 | https://www.csh.org.tw/HR.html | 2026-05-23 |
| cch-main | 彰化基督教醫院 | 醫學中心 | 中彰投 | 彰化縣 | https://www.cch.org.tw/hr1.aspx | 2026-05-23 |
| ncku-main | 成功大學醫學院附設醫院 | 醫學中心 | 雲嘉南 | 臺南市 | https://www.hosp.ncku.edu.tw/external/talentsignup/index.asp | 2026-05-23 |
| chimei-yongkang | 奇美醫院 | 醫學中心 | 雲嘉南 | 臺南市 | https://www.chimei.org.tw/newindex/proclamation/joinuscmh.html | 2026-05-23 |
| kmuh-main | 高雄醫學大學附設中和紀念醫院 | 醫學中心 | 高屏 | 高雄市 | https://www.kmuh.org.tw/Web/HireSystem.MVC/VacancySearch | 2026-05-23 |
| vghks-main | 高雄榮民總醫院 | 醫學中心 | 高屏 | 高雄市 | https://www.vghks.gov.tw/News.aspx?n=C03011BF96C680C4&sms=5EF61FB0D0F5B657 | 2026-05-23 |
| cgmh-kaohsiung | 高雄長庚紀念醫院 | 醫學中心 | 高屏 | 高雄市 | https://www.cgmh.org.tw/tw/Systems/Recruit | 2026-05-23 |
| edah-main | 義大醫院 | 醫學中心 | 高屏 | 高雄市 | https://employee.edah.org.tw/recruit/ | 2026-05-23 |
| tzuchi-hualien | 花蓮慈濟醫院 | 醫學中心 | 宜花東 | 花蓮縣 | https://hlm.tzuchi.com.tw/home/index.php/news/recruit/recruit-tech | 2026-05-23 |
| mmch-taipei | 馬偕兒童醫院 | 醫學中心 | 北北基 | 臺北市 | https://www.mmh.org.tw/hr/stafflist.php | 2026-05-23 |
| cmuch-main | 中國醫藥大學兒童醫院 | 醫學中心 | 中彰投 | 臺中市 | http://www.cmuch.org.tw/Recruit | 2026-05-23 |

---

## 二、邊界案例註記（重要：parser 階段需特別處理）

§2 governing rule 規定 `career_page_url` 必須是醫院官方網域。下列 4 家
雖然入口頁在官方域，但點進去後實際職缺列表會被引導到 104。註冊的入口
URL 本身合規（外連目標仍是醫院自有頁面），但 parser 寫作時要知道
背景：

| hospital_id | 入口頁狀況 | parser 注意事項 |
|---|---|---|
| wanfang-main | 人事室『福利制度與應徵方式』介紹頁，職缺列表 hosted on 104 | parser 只能從介紹頁取得「醫院簡介、福利、應徵方式」，**不可** fetch 104。職缺細節依 §11 LLM-fallback 流程或標 `parse-error` 由 Evelyn 補手填。 |
| shh-main | 北醫大經營，介紹頁在 shh.tmu.edu.tw，職缺列表在 shh.org.tw OldShhorg 子站 | 兩個官方域都允許，parser 可同時抓取補強欄位。 |
| csh-main | 招募簡章下載頁，動態實際職缺多在 104 | 同 wanfang-main 處理原則：只從 csh.org.tw 取介紹/福利，職缺細節留空或人工補。 |
| cch-main | 彰基『加入彰基』入口頁，列出體系下各院區；實際職缺由 104 ehr 子站提供 | 同上。 |

下列共用招募系統（同 URL 多 hospital_id），parser 須能從同一頁面**依
所屬院區欄位過濾**：

- `cgmh-linkou` 與 `cgmh-kaohsiung` 共用 `cgmh.org.tw/tw/Systems/Recruit`
  （長庚醫療財團法人共用招募系統，內含 林口/臺北/基隆/桃園/雲林/嘉義/
  高雄/鳳山 等院區，藥師職缺通常列在「醫技」類）。
- `mmch-taipei` 與 `mmh-taipei` 共用 `mmh.org.tw/hr/stafflist.php`
  （兒童醫院為馬偕臺北院區一部分，職缺列表中可見「兒童醫院」單位標註）。

下列頁面為 JS 動態載入，HTTP GET 抓到的 HTML body 可能為空 — parser
config 寫作時須考慮 LLM-fallback 或改用 headless browser：

- `femh-main` — femh.org.tw/mainpage/femhjob
- `edah-main` — employee.edah.org.tw/recruit/
- `vghtc-main` — vghtc.gov.tw/Module/RecruitMent
- `wanfang-main` — wanfang.gov.tw 介紹頁

優先指向「藥師專屬頁面」的案例（parser 可直接抓相關列表，省去 filter）：

- `tzuchi-taipei` — 已升級到藥師招募專區
  `https://taipei.tzuchi.com.tw/藥師召募/`
- `tzuchi-hualien` — 醫技類專屬頁
  `hlm.tzuchi.com.tw/home/index.php/news/recruit/recruit-tech`
- 其餘多為全院職缺列表，須在 parser 內依「職類=藥師」過濾。

---

## 三、機器鏡像（JSON，供 parser 讀取）

```json
{
  "registry_version": "2026-05-23",
  "scope": "醫學中心 (113 年度評鑑後)",
  "total_entries": 24,
  "hospitals": [
    {
      "hospital_id": "ntuh-main",
      "name": "臺大醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "臺北市",
      "career_page_url": "https://www.ntuh.gov.tw/ntuh/Recruit.action?muid=46",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "官方人才招募頁，分醫師/護理/醫事/行政/其他類別。藥師職缺在『徵才資訊-醫事』分頁 (muid=3183)"
    },
    {
      "hospital_id": "vghtpe-main",
      "name": "臺北榮民總醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "臺北市",
      "career_page_url": "https://www4.vghtpe.gov.tw/conscribe/indexb.htm",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "對外招募公告頁 (PDF 形式逐條公告)。人事室入口備用: https://wd.vghtpe.gov.tw/per/Fpage.action?muid=606&fid=262"
    },
    {
      "hospital_id": "tsgh-main",
      "name": "三軍總醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "臺北市",
      "career_page_url": "https://www1.ndmctsgh.edu.tw/RessourceHumaine/HirP01.aspx",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "三總屬國防醫學中心，招募系統位於 ndmctsgh.edu.tw 子域名（官方）。藥師職缺也走此系統"
    },
    {
      "hospital_id": "mmh-taipei",
      "name": "馬偕紀念醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "臺北市",
      "career_page_url": "https://www.mmh.org.tw/hr/stafflist.php",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "新版招募系統，分醫師/護理/醫事/行政四類。藥師職缺在『醫事』分頁: https://www.mmh.org.tw/hr/catgory3.php"
    },
    {
      "hospital_id": "cgh-main",
      "name": "國泰綜合醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "臺北市",
      "career_page_url": "https://www.cgh.org.tw/ec99/rwd1320/category.asp?category_id=135",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "藥師職缺專屬頁面: https://www.cgh.org.tw/ec99/rwd1320/category.asp?category_id=1699 (醫技/藥事類)"
    },
    {
      "hospital_id": "skh-main",
      "name": "新光吳火獅紀念醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "臺北市",
      "career_page_url": "https://recruitweb.skh.org.tw/Recruit/JobVacancyResume/List",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "官方招募系統 (skh.org.tw 子域)，可篩選職缺類別。需先同意個資聲明"
    },
    {
      "hospital_id": "wanfang-main",
      "name": "萬芳醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "臺北市",
      "career_page_url": "https://www.wanfang.gov.tw/departments/WanfangClass_48/7f6ca32cdb8b7c0a",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "北醫大經營，人力資源室『福利制度與應徵方式』介紹頁。職缺實際 hosted on 104，§2 邊界案例 — parser 只取介紹頁內容，不抓 104"
    },
    {
      "hospital_id": "cgmh-linkou",
      "name": "林口長庚紀念醫院",
      "tier": "醫學中心",
      "region": "桃竹苗",
      "city": "桃園市",
      "career_page_url": "https://www.cgmh.org.tw/tw/Systems/Recruit",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "長庚醫療財團法人共用招募系統（與 cgmh-kaohsiung 同 URL）。parser 需依院區欄位過濾。藥師職缺通常列於『醫技』類: https://www.cgmh.org.tw/tw/Systems/RecruitInfo/3"
    },
    {
      "hospital_id": "femh-main",
      "name": "亞東紀念醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "新北市",
      "career_page_url": "https://www.femh.org.tw/mainpage/femhjob",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "JS 動態載入需 headless browser 或 LLM-fallback。次選: https://hos.femh.org.tw/newfemh/job/job.aspx"
    },
    {
      "hospital_id": "tzuchi-taipei",
      "name": "臺北慈濟醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "新北市",
      "career_page_url": "https://taipei.tzuchi.com.tw/%E8%97%A5%E5%B8%AB%E5%8F%AC%E5%8B%9F/",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "已升級為藥師專屬招募頁（原『人才招募』總頁也在 taipei.tzuchi.com.tw 但同時連 104/1111；藥師專區單純）"
    },
    {
      "hospital_id": "shh-main",
      "name": "衛福部雙和醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "新北市",
      "career_page_url": "https://shh.tmu.edu.tw/page/WelfareRecruited.aspx",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "北醫大經營。新版官方域 shh.tmu.edu.tw，職缺列表也在 shh.tmu.edu.tw/OldShhorg/page/Vacancies.aspx（兩者皆官方）"
    },
    {
      "hospital_id": "vghtc-main",
      "name": "臺中榮民總醫院",
      "tier": "醫學中心",
      "region": "中彰投",
      "city": "臺中市",
      "career_page_url": "https://www.vghtc.gov.tw/Module/RecruitMent?WebMenuID=9d005e46-411b-46fc-b438-e0bd561eba78",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "官方徵才訊息頁，動態載入"
    },
    {
      "hospital_id": "cmuh-main",
      "name": "中國醫藥大學附設醫院",
      "tier": "醫學中心",
      "region": "中彰投",
      "city": "臺中市",
      "career_page_url": "https://www.cmuh.org.tw/CMUHPages/Careers",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "徵才資訊主頁。熱門職缺頁備用: https://www.cmuh.org.tw/Recruit"
    },
    {
      "hospital_id": "csh-main",
      "name": "中山醫學大學附設醫院",
      "tier": "醫學中心",
      "region": "中彰投",
      "city": "臺中市",
      "career_page_url": "https://www.csh.org.tw/HR.html",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "§2 邊界案例：官方人才招募入口存在，但實際職缺多導向 104。頁面內容偏招募簡章下載"
    },
    {
      "hospital_id": "cch-main",
      "name": "彰化基督教醫院",
      "tier": "醫學中心",
      "region": "中彰投",
      "city": "彰化縣",
      "career_page_url": "https://www.cch.org.tw/hr1.aspx",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "§2 邊界案例：『加入彰基』入口頁，列出體系內各院區（二基、員基、南基、雲基等），實際職缺多由 104 ehr 子站提供"
    },
    {
      "hospital_id": "ncku-main",
      "name": "成功大學醫學院附設醫院",
      "tier": "醫學中心",
      "region": "雲嘉南",
      "city": "臺南市",
      "career_page_url": "https://www.hosp.ncku.edu.tw/external/talentsignup/index.asp",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "成大對外徵才系統（包含活動 21+ 筆）。人事室公告頁備用: https://personnel.hosp.ncku.edu.tw/p/403-1006-2667-1.php?Lang=zh-tw"
    },
    {
      "hospital_id": "chimei-yongkang",
      "name": "奇美醫院",
      "tier": "醫學中心",
      "region": "雲嘉南",
      "city": "臺南市",
      "career_page_url": "https://www.chimei.org.tw/newindex/proclamation/joinuscmh.html",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "奇美總院招募主頁，分主治醫師/住院醫師/護理/醫技/行政類別。藥師屬醫技類"
    },
    {
      "hospital_id": "kmuh-main",
      "name": "高雄醫學大學附設中和紀念醫院",
      "tier": "醫學中心",
      "region": "高屏",
      "city": "高雄市",
      "career_page_url": "https://www.kmuh.org.tw/Web/HireSystem.MVC/VacancySearch",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "高醫體系招募系統，含附設中和紀念、小港、旗津、岡山等院區。實見藥師職缺直接刊登"
    },
    {
      "hospital_id": "vghks-main",
      "name": "高雄榮民總醫院",
      "tier": "醫學中心",
      "region": "高屏",
      "city": "高雄市",
      "career_page_url": "https://www.vghks.gov.tw/News.aspx?n=C03011BF96C680C4&sms=5EF61FB0D0F5B657",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "高榮『就業資訊』官方頁。藥學部主頁參考: https://org.vghks.gov.tw/ph"
    },
    {
      "hospital_id": "cgmh-kaohsiung",
      "name": "高雄長庚紀念醫院",
      "tier": "醫學中心",
      "region": "高屏",
      "city": "高雄市",
      "career_page_url": "https://www.cgmh.org.tw/tw/Systems/Recruit",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "與林口長庚共用長庚醫療財團法人招募系統（同 URL）。parser 需依院區欄位過濾"
    },
    {
      "hospital_id": "edah-main",
      "name": "義大醫院",
      "tier": "醫學中心",
      "region": "高屏",
      "city": "高雄市",
      "career_page_url": "https://employee.edah.org.tw/recruit/",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "義大醫療財團法人官方招募網。動態載入需 JS"
    },
    {
      "hospital_id": "tzuchi-hualien",
      "name": "花蓮慈濟醫院",
      "tier": "醫學中心",
      "region": "宜花東",
      "city": "花蓮縣",
      "career_page_url": "https://hlm.tzuchi.com.tw/home/index.php/news/recruit/recruit-tech",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "直接指向醫技類專屬頁（含藥師）。招募總頁: https://hlm.tzuchi.com.tw/home/index.php/news/recruit"
    },
    {
      "hospital_id": "mmch-taipei",
      "name": "馬偕兒童醫院",
      "tier": "醫學中心",
      "region": "北北基",
      "city": "臺北市",
      "career_page_url": "https://www.mmh.org.tw/hr/stafflist.php",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "兒童醫院為馬偕臺北院區一部分，職缺與母院共用同一招募系統（與 mmh-taipei 同 URL）。職缺列表中『單位』欄會標註『兒童醫院』"
    },
    {
      "hospital_id": "cmuch-main",
      "name": "中國醫藥大學兒童醫院",
      "tier": "醫學中心",
      "region": "中彰投",
      "city": "臺中市",
      "career_page_url": "http://www.cmuch.org.tw/Recruit",
      "verified_date": "2026-05-23",
      "parser_config_path": null,
      "notes": "兒童醫院有獨立官方網域 cmuch.org.tw，與母院共用招募體系。母院招募頁備用: https://www.cmuh.org.tw/CMUHPages/Careers"
    }
  ]
}
```

---

## 四、待確認清單

**（無）** — 本批 24 家醫學中心皆已找到官方招募 URL 並經驗證可載入。

> 若日後出現以下情況，新增至此區並註明嘗試過的搜尋關鍵字 + 最接近的頁面：
> - 醫院改版 URL 失效
> - 113→114 年度評鑑後新增/降級醫學中心
> - 區域醫院/地區醫院擴充階段（v4 §8 Week 7+）找不到官方招募頁

---

## 五、phasing 紀錄

| Phase | 範圍 | 狀態 |
|---|---|---|
| 1 | 23 家醫學中心 URL 註冊（本檔，24 條含兒童醫院） | **本次完成 (2026-05-23)** |
| 2 | 對應 `parsers/{hospital_id}.json` CSS 選擇器設定 | 待 v4 §8 Week 4–5 |
| 3 | ~80+ 區域醫院 URL（templated） | v4 §8 Week 7+ |
| 4 | 地區醫院 URL（LLM-fallback 為主） | post-launch |

---

## 六、§2 自查清單（每次更新此檔必須跑過）

- [x] 所有 `career_page_url` 的 hostname 在醫院/醫療體系自有網域下
- [x] 沒有任何 URL 指向 104.com.tw / 1111.com.tw / yes123.com.tw /
      cake.me / indeed.com / linkedin.com 等第三方人力銀行
- [x] 邊界案例（入口頁雖在官方域，內部連往 104）已在「邊界案例註記」
      區段明列，提醒 parser 階段不可跨頁抓 104
- [x] 共用招募系統的多 hospital_id 已標註（cgmh、mmh 系列）
- [x] verified_date 為實際 fetch 驗證當日（2026-05-23）
