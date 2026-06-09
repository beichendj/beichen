﻿"use client"

import { useState, useMemo, useCallback, useRef } from "react"

// ===== Types =====
interface FieldOption {
  id: number
  field_id: number
  option_name: string
  ratio_param: number
}

interface FieldRange {
  id: number
  field_id: number
  range_min: number
  range_max: number
  ratio_param: number
}

interface FormField {
  id: number
  name: string
  type: "input" | "select"
  affects_ratio: boolean
  allow_multiple: boolean
  ratio_min_limit: number | null
  ratio_max_limit: number | null
  remark: string | null
  sort_order: number
  options?: FieldOption[]
  ranges?: FieldRange[]
}

interface ComboRule {
  id: number
  insurance_field_id: number
  insurance_value: string
  stamina_field_id: number
  stamina_value: string
  weight_field_id: number
  weight_value: string
  adjusted_ratio: number
  remark: string
}

interface TransactionImage {
  id: number
  section_id: number
  image_url: string
  sort_order: number
}

interface TransactionSection {
  id: number
  title: string
  sort_order: number
  images: TransactionImage[]
}

interface FormConfig {
  initial_ratio: number
  float_amount: number
  announcement_text: string
  announcement_enabled: number
  qrcode_url: string
  listing_notice: string
  about_us: string
  transaction_sections: TransactionSection[]
  fields: FormField[]
  combo_rules: ComboRule[]
}

// ===== Config =====
const FORM_CONFIG: FormConfig = {
  initial_ratio: 53,
  float_amount: 1,
  announcement_text: "温馨提示：认准北辰商行上架Q群管理员，私聊出/租均为骗子",
  announcement_enabled: 1,
  qrcode_url: "/images/qrcode_floating.jpeg",
  listing_notice:
    '<h1 style="text-align:center"><span style="color:rgb(230,0,0)">上架须知（号主必看）</span></h1><p>号主认真读好条约</p><p><br></p><p>否则出了问题商行概不负责</p><p><br></p><p>⚠️ 号主须知:</p><p><br></p><p>一、【信息核实】</p><p>如实填写纯币数量！（<span style="color:rgb(230,0,0)">填少了扣除租金，多填写的部分算赠送</span>）。人脸非本人的不收！如打到一半跳人脸号主告知非本人人脸所造成的损耗自己承担！</p><p><br></p><p>二、【仓库问题】</p><p>上号前号主需要整理仓库，除了纯币外其他东西统一折算成哈弗币（号主自愿赠送除外）</p><p>固定道具价格：六头：2r 六甲2r  45格红包：2r，体验卡：4r一张  红蛋：6r一组</p><p><br></p><p>三、【封号问题】号主提前留存好截图超过数据不明确的不计入，打手打完后自行截图留存，结算双方数据扯皮，俱乐部只认证据，不听解释，永久封号押金不退全额补偿号主，护航踢不补时长，不扣押金，其余按天数*10扣除押金赔偿号主，账号出租中不退不换，有顶号行为打手可举报，一次由号主赔偿10米给打手，多次顶号不配合可终止租赁，正常结算后号主填下表发到群内打手核对，<span style="color:rgb(230,0,0)">一经结算后，号主改账密取消登陆设备，所有后续异常封禁不予处理</span></p><p><br></p><p>四、【租客上号】拉群后沟通上号时间，如果两次以上打手无法联系到号主则算作结单，消耗的哈弗币自己承担！</p><p><br></p><p>五、【私下交易】<span style="color:rgb(230,0,0)">不可私加打手微信好友，一旦私加扣除所有租金</span>（不听理由，但凡打手发出截图次单不结算）</p><p><br></p><p>六、【结算方式】商行要求打手必须在规定时间内打完，特殊情况号主和打手可协商！打完或租期时间到了就可以结账了（默认最低消耗10m/天）<span style="color:rgb(230,0,0)">⚠️号主结算时扣除12%的总租金作为手续费</span>（不要觉得我们商行黑！去对比一下这个比例加手续费也比其他商行给的高！望周知！！！！）</p><p><br></p><p>此须知号主必看，忽略此须知所造成的所有后果和损失商行概不负责。最终解释权归北辰商行所有.</p>',
  about_us:
    '<h2>✅<strong>真实力:我们是</strong><strong style="color:rgb(230,0,0)">线下实体</strong><strong>公司，拒绝"空手套白狼"，人跑得了，店跑不了，给你的资金上"双保险"。</strong></h2><h2>✅<strong>大数据:已累计服务</strong><strong style="color:rgb(230,0,0)">30,000+</strong><strong>号主。能服务这么多人，靠的不是低价套路，而是实打实的诚信与口碑。</strong></h2><h2>✅<strong>硬售后:</strong><strong style="color:rgb(230,0,0)">交易讲公正公平，过程全透明</strong><strong>。若有任何问题，我们负责到底，售后不扯皮，让你卖得明明白白。</strong></h2><h2><span style="color:rgb(230,0,0)">哈弗换米认准北辰商行，省心又放心!欢迎新老朋友捧场!</span></h2><p><br></p>',
  transaction_sections: [
    {
      id: 5,
      title: "号主好评",
      sort_order: 2,
      images: [
        { id: 3, section_id: 5, image_url: "/images/zhage_tx1.png", sort_order: 1 },
        { id: 4, section_id: 5, image_url: "/images/zhage_tx2.png", sort_order: 2 },
        { id: 5, section_id: 5, image_url: "/images/zhage_tx3.png", sort_order: 3 },
      ],
    },
  ],
  fields: [
    {
      id: 33,
      name: "哈夫币纯币（单位M，1M=100W）",
      type: "input",
      affects_ratio: true,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: "温馨提示：纯币小于30M无法寄售租赁",
      sort_order: 1,
      ranges: [
        { id: 44, field_id: 33, range_min: 149, range_max: 239, ratio_param: 0.5 },
        { id: 45, field_id: 33, range_min: 240, range_max: 339, ratio_param: 1 },
        { id: 46, field_id: 33, range_min: 340, range_max: 439, ratio_param: 1.5 },
        { id: 47, field_id: 33, range_min: 440, range_max: 540, ratio_param: 2.5 },
        { id: 48, field_id: 33, range_min: 541, range_max: 639, ratio_param: 3.5 },
        { id: 49, field_id: 33, range_min: 640, range_max: 839, ratio_param: 4 },
        { id: 50, field_id: 33, range_min: 840, range_max: 1149, ratio_param: 5 },
        { id: 43, field_id: 33, range_min: 1150, range_max: 3000, ratio_param: 6 },
      ],
    },
    {
      id: 36,
      name: "上号方式",
      type: "select",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 1,
      options: [
        { id: 11, field_id: 36, option_name: "QQ账号密码", ratio_param: 0 },
        { id: 12, field_id: 36, option_name: "QQ扫码", ratio_param: 0 },
        { id: 13, field_id: 36, option_name: "VX扫码", ratio_param: 0 },
      ],
    },
    {
      id: 37,
      name: "段位",
      type: "select",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 2,
      options: [
        { id: 14, field_id: 37, option_name: "青铜", ratio_param: 0 },
        { id: 15, field_id: 37, option_name: "白银", ratio_param: 0 },
        { id: 16, field_id: 37, option_name: "黄金", ratio_param: 0 },
        { id: 17, field_id: 37, option_name: "铂金", ratio_param: 0 },
        { id: 27, field_id: 37, option_name: "钻石", ratio_param: 0 },
        { id: 28, field_id: 37, option_name: "黑鹰", ratio_param: 0 },
        { id: 29, field_id: 37, option_name: "三角洲巅峰", ratio_param: 0 },
      ],
    },
    {
      id: 38,
      name: "绝密KD",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 3,
      ranges: [],
    },
    {
      id: 39,
      name: "等级",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 5,
      ranges: [],
    },
    {
      id: 40,
      name: "3*3体验卡数量（张）",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 6,
      ranges: [],
    },
    {
      id: 41,
      name: "保险格数",
      type: "select",
      affects_ratio: true,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 7,
      options: [
        { id: 18, field_id: 41, option_name: "4格", ratio_param: 1 },
        { id: 19, field_id: 41, option_name: "6格", ratio_param: 0 },
        { id: 20, field_id: 41, option_name: "9格", ratio_param: -1 },
      ],
    },
    {
      id: 42,
      name: "体力（训练中心）",
      type: "select",
      affects_ratio: true,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 8,
      options: [
        { id: 30, field_id: 42, option_name: "1", ratio_param: 1 },
        { id: 31, field_id: 42, option_name: "2", ratio_param: 1 },
        { id: 32, field_id: 42, option_name: "3", ratio_param: 1 },
        { id: 33, field_id: 42, option_name: "4", ratio_param: 0.5 },
        { id: 34, field_id: 42, option_name: "5", ratio_param: 0.5 },
        { id: 35, field_id: 42, option_name: "6", ratio_param: 0 },
        { id: 36, field_id: 42, option_name: "7", ratio_param: -0.5 },
      ],
    },
    {
      id: 43,
      name: "负重（靶场等级）",
      type: "select",
      affects_ratio: true,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 9,
      options: [
        { id: 37, field_id: 43, option_name: "1", ratio_param: 1 },
        { id: 38, field_id: 43, option_name: "2", ratio_param: 1 },
        { id: 39, field_id: 43, option_name: "3", ratio_param: 1 },
        { id: 40, field_id: 43, option_name: "4", ratio_param: 0.5 },
        { id: 41, field_id: 43, option_name: "5", ratio_param: 0.5 },
        { id: 42, field_id: 43, option_name: "6", ratio_param: 0 },
        { id: 43, field_id: 43, option_name: "7", ratio_param: -0.5 },
      ],
    },
    {
      id: 44,
      name: "AWM子弹数量",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: "道具价格为：AW0.8W一发，头2甲2 咖啡豆4r 金全装包为5r AW全装包10r 其余卡或甲修等宜折算哈夫币的统一按比列折算",
      sort_order: 10,
      ranges: [],
    },
    {
      id: 45,
      name: "6头数量",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 11,
      ranges: [],
    },
    {
      id: 46,
      name: "6甲数量",
      type: "input",
      affects_ratio: true,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 11,
      ranges: [],
    },
    {
      id: 47,
      name: "刀皮（有的话回收比例-1）",
      type: "select",
      affects_ratio: true,
      allow_multiple: true,
      ratio_min_limit: -1,
      ratio_max_limit: null,
      remark: null,
      sort_order: 12,
      options: [
        { id: 21, field_id: 47, option_name: "龙牙", ratio_param: -1 },
        { id: 22, field_id: 47, option_name: "信条", ratio_param: -1 },
        { id: 44, field_id: 47, option_name: "怜悯", ratio_param: -1 },
        { id: 45, field_id: 47, option_name: "赤枭", ratio_param: -1 },
        { id: 46, field_id: 47, option_name: "北极星", ratio_param: -1 },
        { id: 47, field_id: 47, option_name: "黑海", ratio_param: -1 },
        { id: 48, field_id: 47, option_name: "影锋", ratio_param: -1 },
        { id: 55, field_id: 47, option_name: "暗星", ratio_param: -1 },
        { id: 58, field_id: 47, option_name: "坠星者", ratio_param: -1 },
        { id: 59, field_id: 47, option_name: "电锯", ratio_param: 0 },
        { id: 60, field_id: 47, option_name: "处刑者", ratio_param: 0 },
      ],
    },
    {
      id: 48,
      name: "干员红皮",
      type: "select",
      affects_ratio: false,
      allow_multiple: true,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 13,
      options: [
        { id: 23, field_id: 48, option_name: "吴彦祖", ratio_param: 0 },
        { id: 49, field_id: 48, option_name: "蚀金玫瑰", ratio_param: 0 },
        { id: 50, field_id: 48, option_name: "午夜邮差", ratio_param: 0 },
        { id: 51, field_id: 48, option_name: "天际线", ratio_param: 0 },
        { id: 52, field_id: 48, option_name: "维什戴尔", ratio_param: 0 },
        { id: 53, field_id: 48, option_name: "水墨云图", ratio_param: 0 },
        { id: 56, field_id: 48, option_name: "凌霄戍卫", ratio_param: 0 },
      ],
    },
    {
      id: 49,
      name: "武器皮肤",
      type: "select",
      affects_ratio: false,
      allow_multiple: true,
      ratio_min_limit: -1,
      ratio_max_limit: null,
      remark: null,
      sort_order: 14,
      options: [
        { id: 24, field_id: 49, option_name: "AS Val悬赏令", ratio_param: 0 },
        { id: 25, field_id: 49, option_name: "M7棱镜攻势", ratio_param: 0 },
        { id: 57, field_id: 49, option_name: "kc17创物纪元", ratio_param: 0 },
      ],
    },
    {
      id: 50,
      name: "押金（租客缴纳，封号赔偿用，号主必填）",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: "不清楚询问客服合适押金，押金为租客缴纳，用于赔偿毁号或封号等",
      sort_order: 15,
      ranges: [],
    },
    {
      id: 51,
      name: "号主在线时间（需配合人脸验证！）",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 16,
      ranges: [],
    },
    {
      id: 52,
      name: "封禁记录（没有可不填写）",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: null,
      sort_order: 17,
      ranges: [],
    },
    {
      id: 35,
      name: "租期（天）",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: "PS：例如100M的号，最多只会被出租10天，超过租期按照出租金额全款结账！正常租期单位10M=1天",
      sort_order: 18,
      ranges: [],
    },
    {
      id: 53,
      name: "联系号码",
      type: "input",
      affects_ratio: false,
      allow_multiple: false,
      ratio_min_limit: null,
      ratio_max_limit: null,
      remark: "必须填写号主，方便联系上下号",
      sort_order: 19,
      ranges: [],
    },
  ],
  combo_rules: [
    { id: 72, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "3", adjusted_ratio: 51, remark: "433" },
    { id: 71, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "2", adjusted_ratio: 50.5, remark: "442" },
    { id: 70, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "3", adjusted_ratio: 50, remark: "443" },
    { id: 69, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "4", adjusted_ratio: 49.5, remark: "444" },
    { id: 68, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "5", adjusted_ratio: 49, remark: "445" },
    { id: 67, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "6", adjusted_ratio: 49, remark: "446" },
    { id: 66, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "7", adjusted_ratio: 48.5, remark: "447" },
    { id: 65, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "3", adjusted_ratio: 49.5, remark: "453" },
    { id: 64, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "4", adjusted_ratio: 49, remark: "454" },
    { id: 63, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "5", adjusted_ratio: 49, remark: "455" },
    { id: 62, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "6", adjusted_ratio: 48.5, remark: "456" },
    { id: 61, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "7", adjusted_ratio: 48, remark: "457" },
    { id: 60, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "3", adjusted_ratio: 48.5, remark: "463" },
    { id: 59, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "4", adjusted_ratio: 48.5, remark: "464" },
    { id: 58, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "5", adjusted_ratio: 47, remark: "465" },
    { id: 57, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "6", adjusted_ratio: 47.5, remark: "466" },
    { id: 56, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "7", adjusted_ratio: 47.5, remark: "467" },
    { id: 55, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "3", adjusted_ratio: 48, remark: "473" },
    { id: 54, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "4", adjusted_ratio: 47.5, remark: "474" },
    { id: 53, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "5", adjusted_ratio: 47, remark: "475" },
    { id: 52, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "6", adjusted_ratio: 47, remark: "476" },
    { id: 51, insurance_field_id: 41, insurance_value: "4格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "7", adjusted_ratio: 46.5, remark: "477" },
    { id: 50, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "3", adjusted_ratio: 46.5, remark: "633" },
    { id: 49, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "4", adjusted_ratio: 47, remark: "634" },
    { id: 48, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "5", adjusted_ratio: 46.5, remark: "635" },
    { id: 47, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "6", adjusted_ratio: 46, remark: "636" },
    { id: 46, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "7", adjusted_ratio: 45.5, remark: "637" },
    { id: 45, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "3", adjusted_ratio: 46.5, remark: "643" },
    { id: 44, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "4", adjusted_ratio: 46, remark: "644" },
    { id: 43, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "5", adjusted_ratio: 46, remark: "645" },
    { id: 42, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "6", adjusted_ratio: 45.5, remark: "646" },
    { id: 41, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "7", adjusted_ratio: 45.5, remark: "647" },
    { id: 40, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "3", adjusted_ratio: 46, remark: "653" },
    { id: 39, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "4", adjusted_ratio: 45.5, remark: "654" },
    { id: 38, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "5", adjusted_ratio: 45.5, remark: "655" },
    { id: 37, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "6", adjusted_ratio: 45, remark: "656" },
    { id: 36, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "7", adjusted_ratio: 44.5, remark: "657" },
    { id: 35, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "3", adjusted_ratio: 45.5, remark: "663" },
    { id: 34, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "4", adjusted_ratio: 45, remark: "664" },
    { id: 33, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "5", adjusted_ratio: 45, remark: "665" },
    { id: 32, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "6", adjusted_ratio: 44.5, remark: "666" },
    { id: 31, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "7", adjusted_ratio: 44.5, remark: "667" },
    { id: 30, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "3", adjusted_ratio: 45.5, remark: "673" },
    { id: 29, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "4", adjusted_ratio: 45, remark: "674" },
    { id: 28, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "5", adjusted_ratio: 44.5, remark: "675" },
    { id: 27, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "6", adjusted_ratio: 44.5, remark: "676" },
    { id: 26, insurance_field_id: 41, insurance_value: "6格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "7", adjusted_ratio: 44, remark: "677" },
    { id: 25, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "3", adjusted_ratio: 43, remark: "933" },
    { id: 24, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "4", adjusted_ratio: 42.5, remark: "934" },
    { id: 23, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "5", adjusted_ratio: 42.5, remark: "935" },
    { id: 22, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "6", adjusted_ratio: 42, remark: "936" },
    { id: 21, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "3", weight_field_id: 43, weight_value: "7", adjusted_ratio: 41.5, remark: "937" },
    { id: 20, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "3", adjusted_ratio: 42.5, remark: "943" },
    { id: 19, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "4", adjusted_ratio: 42, remark: "944" },
    { id: 18, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "5", adjusted_ratio: 41.5, remark: "945" },
    { id: 17, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "6", adjusted_ratio: 41.5, remark: "946" },
    { id: 16, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "4", weight_field_id: 43, weight_value: "7", adjusted_ratio: 41.5, remark: "947" },
    { id: 15, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "3", adjusted_ratio: 42, remark: "953" },
    { id: 14, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "4", adjusted_ratio: 41.5, remark: "954" },
    { id: 13, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "5", adjusted_ratio: 41, remark: "955" },
    { id: 12, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "6", adjusted_ratio: 41, remark: "956" },
    { id: 11, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "5", weight_field_id: 43, weight_value: "7", adjusted_ratio: 40.5, remark: "957" },
    { id: 10, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "3", adjusted_ratio: 42, remark: "963" },
    { id: 9, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "4", adjusted_ratio: 41.5, remark: "964" },
    { id: 8, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "5", adjusted_ratio: 41, remark: "965" },
    { id: 7, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "6", adjusted_ratio: 40.5, remark: "966" },
    { id: 6, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "6", weight_field_id: 43, weight_value: "7", adjusted_ratio: 40.5, remark: "967" },
    { id: 5, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "3", adjusted_ratio: 41.5, remark: "973" },
    { id: 4, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "4", adjusted_ratio: 41, remark: "974" },
    { id: 3, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "5", adjusted_ratio: 40.5, remark: "975" },
    { id: 2, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "6", adjusted_ratio: 40.5, remark: "976" },
    { id: 1, insurance_field_id: 41, insurance_value: "9格", stamina_field_id: 42, stamina_value: "7", weight_field_id: 43, weight_value: "7", adjusted_ratio: 40, remark: "977" },
  ],
}

// ===== Component =====
export default function PublicPage() {
  const [formValues, setFormValues] = useState<Record<number, string | string[]>>({})
  const [openMultiSelect, setOpenMultiSelect] = useState<number | null>(null)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const cfg = FORM_CONFIG

  // ---- Helpers ----
  const getVal = (id: number): string => (formValues[id] as string) ?? ""
  const getMultiVal = (id: number): string[] => {
    const v = formValues[id]
    return Array.isArray(v) ? v : []
  }

  const setVal = useCallback((id: number, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }))
  }, [])

  const setMultiVal = useCallback((id: number, value: string[]) => {
    setFormValues((prev) => ({ ...prev, [id]: value }))
  }, [])

  // ---- Auto-calculate rent from hafu ----
  const hafuVal = useMemo(() => parseFloat(getVal(33)) || 0, [formValues])
  const autoPeriod = useMemo(() => (hafuVal > 0 ? Math.floor(hafuVal / 10) : 0), [hafuVal])

  // ---- Ratio & Rental calculation ----
  const { ratio, rental } = useMemo(() => {
    let totalRatio = cfg.initial_ratio

    // Combo rule check
    const insVal = getVal(41)
    const staVal = getVal(42)
    const wgtVal = getVal(43)
    let matchedCombo: ComboRule | null = null
    if (insVal && staVal && wgtVal) {
      const found = cfg.combo_rules.find(
        (r) =>
          r.insurance_value === insVal &&
          r.stamina_value === staVal &&
          r.weight_value === wgtVal
      )
      if (found) {
        totalRatio = found.adjusted_ratio
        matchedCombo = found
      }
    }

      cfg.fields.forEach((f) => {
        if (!f.affects_ratio) return

        // Skip the three combo fields (保险格数/体力/负重) when a combo rule is active
        if (matchedCombo && (
          f.id === matchedCombo.insurance_field_id ||
          f.id === matchedCombo.stamina_field_id ||
          f.id === matchedCombo.weight_field_id
        )) {
          return
        }

        if (f.type === "input") {
          const val = parseFloat(getVal(f.id))
          if (isNaN(val)) return
          // Range-based ratio
          if (f.ranges && f.ranges.length > 0) {
            const range = f.ranges.find((r) => val >= r.range_min && val <= r.range_max)
            if (range) totalRatio += range.ratio_param
          }
        } else if (f.type === "select") {
          if (f.allow_multiple) {
            const checked = getMultiVal(f.id)
            if (checked.length > 0) {
              let fieldRatio = 0
              checked.forEach((optName) => {
                const opt = f.options?.find((o) => o.option_name === optName)
                if (opt) fieldRatio += opt.ratio_param
              })
              if (f.ratio_min_limit !== null && fieldRatio < f.ratio_min_limit) {
                fieldRatio = f.ratio_min_limit
              }
              totalRatio += fieldRatio
            }
          } else {
            const val = getVal(f.id)
            if (!val) return
            const opt = f.options?.find((o) => o.option_name === val)
            if (opt) totalRatio += opt.ratio_param
          }
        }
      })




    totalRatio = parseFloat(totalRatio.toFixed(2))

    // Rental
    const floatAmt = cfg.float_amount || 0
    let rent = "--"
    if (hafuVal > 0 && totalRatio > 0) {
      rent = String(Math.floor((hafuVal * 100) / totalRatio) - floatAmt)
    }

    return { ratio: String(totalRatio.toFixed(2)), rental: rent }
  }, [formValues, cfg, hafuVal])

  // ---- Multi-select toggle ----
  const toggleDropdown = useCallback(
    (fieldId: number) => {
      setOpenMultiSelect((prev) => (prev === fieldId ? null : fieldId))
    },
    []
  )

  const closeDropdown = useCallback(() => {
    setOpenMultiSelect(null)
  }, [])

  const toggleMultiOption = useCallback(
    (fieldId: number, optionName: string) => {
      const current = getMultiVal(fieldId)
      const idx = current.indexOf(optionName)
      let next: string[]
      if (idx >= 0) {
        next = current.filter((v) => v !== optionName)
      } else {
        next = [...current, optionName]
      }
      setMultiVal(fieldId, next)
    },
    [formValues, setMultiVal]
  )

  // ---- Modals ----
  const openModal = useCallback((name: string) => {
    setActiveModal(name)
    document.body.style.overflow = "hidden"
  }, [])

  const closeModal = useCallback(() => {
    setActiveModal(null)
    document.body.style.overflow = ""
  }, [])

  // ---- Image preview ----
  const openPreview = useCallback((url: string) => {
    setPreviewUrl(url)
    setActiveModal("preview")
  }, [])

  // ---- Copy ----
  const copyToClipboard = useCallback(() => {
    if (!getVal(33)) {
      alert("请先填写哈夫币纯币数量");
      return;
    }
    const lines = ["北辰商行 · 租号估价表", ""]
    cfg.fields.forEach((f) => {
      if (f.type === "select" && f.allow_multiple) {
        const vals = getMultiVal(f.id)
        if (vals.length) lines.push(f.name + ": " + vals.join(", "))
      } else {
        const val = getVal(f.id)
        if (val) lines.push(f.name + ": " + val)
      }
    })
    lines.push("回收比例: " + ratio)
    lines.push("回收租金: " + rental)
    const text = lines.join("\n")

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => alert("已复制到剪切板！"),
        () => fallbackCopy(text)
      )
    } else {
      fallbackCopy(text)
    }
  }, [cfg, formValues, ratio, rental])

  function fallbackCopy(text: string) {
    if (textareaRef.current) {
      textareaRef.current.value = text
      textareaRef.current.style.display = "block"
      textareaRef.current.select()
      try {
        document.execCommand("copy")
        alert("已复制到剪切板！")
      } catch {
        alert("复制失败，请手动复制")
      }
      textareaRef.current.style.display = "none"
    }
  }

  // ---- Render helpers ----
  const isRequired = (name: string) => name.indexOf("纯币") > -1 || name.indexOf("联系") > -1

  return (
    <>
      {/* ===== Custom styles ===== */}
      <style>{`
        .public-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: public-marquee-kf 18s linear infinite;
          color: #dc2626;
          font-size: 13px;
          font-weight: 500;
        }
        @keyframes public-marquee-kf {
          0% { transform: translateX(102%); }
          100% { transform: translateX(-102%); }
        }
        .public-chip-in {
          animation: public-chip-kf 0.2s ease-out;
        }
        @keyframes public-chip-kf {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .public-modal-in {
          animation: public-modal-kf 0.25s ease-out;
        }
        @keyframes public-modal-kf {
          from { opacity: 0; transform: translateY(-20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        body.modal-open { overflow: hidden; }
        .select-bg-arrow {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .public-field-marker { display: inline-block; width: 7px; height: 7px; flex-shrink: 0; transform: rotate(45deg); border-radius: 1px; }
        .public-game-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.5px; color:rgba(255,255,255,0.85); background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); backdrop-filter:blur(4px); }
        .public-tactical-stripe { height:2.5px; width:60px; border-radius:2px; margin:0 auto; background: linear-gradient(90deg,transparent,rgba(201,168,76,0.6),rgba(201,168,76,0.8),rgba(201,168,76,0.6),transparent); }
        .public-corner-bracket.br { bottom:8px; right:8px; border-width:0 1.5px 1.5px 0; border-radius:0 0 2px 0; }
        .public-corner-bracket.bl { bottom:8px; left:8px; border-width:0 0 1.5px 1.5px; border-radius:0 0 0 2px; }
        .public-corner-bracket.tr { top:8px; right:8px; border-width:1.5px 1.5px 0 0; border-radius:0 2px 0 0; }
        .public-corner-bracket.tl { top:8px; left:8px; border-width:1.5px 0 0 1.5px; border-radius:2px 0 0 0; }
        .public-corner-bracket { position: absolute; width: 16px; height: 16px; border-color: rgba(255,255,255,0.2); border-style: solid; }
        .public-delta-emblem svg { width: 100%; height: 100%; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); }
        .public-delta-emblem { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; }
        }
            repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(255,255,255,0.05) 24px,rgba(255,255,255,0.05) 25px);
            repeating-linear-gradient(-60deg,transparent,transparent 14px,rgba(255,255,255,0.06) 14px,rgba(255,255,255,0.06) 15px),
            repeating-linear-gradient(60deg,transparent,transparent 14px,rgba(255,255,255,0.06) 14px,rgba(255,255,255,0.06) 15px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 0.5px, transparent 0.5px),
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0.5px, transparent 0.5px),
          background-image:
        .public-hex-bg { position: absolute; inset: 0; z-index: 0; border-radius: inherit; opacity: 0.12;
        /* ===== Delta Force / 三角洲行动 Theming ===== */
      `}</style>

      <div
        className="mx-auto"
        style={{ maxWidth: 520, padding: "0 12px 40px", borderRadius: 16, overflow: "hidden", fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Helvetica Neue", sans-serif' }}
      >
        {/* ===== Header ===== */}
        <div className="relative text-center" style={{ padding: "36px 16px 28px" }}>
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "linear-gradient(160deg, #0a1f3f 0%, #132e5e 40%, #1a3d7a 100%)",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,0.08) 0%, transparent 70%)",
                borderRadius: "16px 16px 0 0",
              }}
            />
            <div className="public-hex-bg" />
          </div>

          <div className="public-corner-bracket tl" />
          <div className="public-corner-bracket tr" />
          <div className="public-corner-bracket bl" />
          <div className="public-corner-bracket br" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="public-delta-emblem">
                <svg viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="dlg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#d4af37" />
                      <stop offset="100%" stop-color="#b8942e" />
                    </linearGradient>
                  </defs>
                  <polygon points="21,1 41,36 1,36" fill="none" stroke="url(#dlg)" stroke-width="1.8" />
                  <polygon points="21,10 33,32 9,32" fill="none" stroke="url(#dlg)" stroke-width="1.5" opacity="0.7" />
                  <circle cx="21" cy="26" r="3" fill="#d4af37" />
                  <line x1="21" y1="36" x2="21" y2="39" stroke="#d4af37" stroke-width="1.2" opacity="0.5" />
                  <line x1="11" y1="37" x2="31" y2="37" stroke="#d4af37" stroke-width="1.2" opacity="0.3" />
                </svg>
              </div>
              <img src="/images/logo.png" alt="北辰商行" className="size-16 rounded-lg object-cover" style={{ border: "2px solid rgba(255,255,255,0.2)", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }} />
              <div className="text-left">
                <div className="text-white font-bold tracking-wider" style={{ fontSize: 22, letterSpacing: 2 }}>北辰商行</div>
                <div className="text-white/45 text-xs tracking-widest mt-0.5">BEI CHENG SHANG HANG</div>
              </div>
            </div>

            <h1 className="text-white font-bold tracking-wide mb-1" style={{ fontSize: 26, letterSpacing: 1 }}>
              三角洲租号估价表
            </h1>
            <p className="text-white/75 text-xs tracking-wide" style={{ letterSpacing: 0.5 }}>
              快速估价 · 安全交易
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="public-game-badge">
                <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 12,10 0,10" fill="#d4af37" opacity="0.8" /></svg>
                三角洲行动
              </span>
              <span className="public-game-badge">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.5)" stroke-width="1" /><circle cx="6" cy="6" r="2" fill="rgba(255,255,255,0.5)" /></svg>
                TACTICAL
              </span>
            </div>
            <div className="public-tactical-stripe mt-3" />
          </div>
        </div>

        {/* ===== Announcement ===== */}
        {cfg.announcement_enabled && cfg.announcement_text && (
          <div
            className="flex items-center gap-2.5 overflow-hidden mb-3.5"
            style={{
              background: "linear-gradient(135deg, #f7f3e8, #efe9da)",
              border: "1px solid #d4c8a8",
              borderRadius: 10, padding: "10px 14px",
            }}
          >
            <span className="shrink-0" style={{ fontSize: 17 }}>📢</span>
            <div className="flex-1 overflow-hidden">
              <span className="public-marquee">{cfg.announcement_text}</span>
            </div>
          </div>
        )}

        {/* ===== Action Buttons ===== */}
        <div className="flex gap-2 mb-3.5">
          {cfg.listing_notice && cfg.listing_notice.trim() && (
            <button
              onClick={() => openModal("notice")}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold rounded-xl cursor-pointer transition-all duration-200"
              style={{
                border: "none",
            background: "linear-gradient(135deg, #0f2b2b, #1a3d3d, #2a5a4a)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(201,168,76,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,168,76,0.5)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none"
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,168,76,0.35)"
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              上架须知
            </button>
          )}

          
          {cfg.about_us && cfg.about_us.trim() && (
            <button
              onClick={() => openModal("aboutus")}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold rounded-xl cursor-pointer transition-all duration-200"
              style={{
                border: "none",
            background: "linear-gradient(135deg, #0f2b2b, #1a3d3d, #2a5a4a)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(19,46,94,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(19,46,94,0.5)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none"
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(19,46,94,0.35)"
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              关于我们
            </button>
          )}
        </div>

        {/* ===== Form Fields ===== */}
        {cfg.fields.map((f) => (
          <div key={f.id} className="mb-4">
            <label className="flex items-center gap-1.5 mb-1.5 text-sm font-semibold tracking-tight" style={{ color: "#0a1f3f" }}>
                <span className="public-field-marker" style={{ background: isRequired(f.name) ? "#e03030" : "#1a3d7a" }} />
              {f.name}
            </label>

            {/* Select - single */}
            {f.type === "select" && !f.allow_multiple && (
              <select
                value={getVal(f.id)}
                onChange={(e) => setVal(f.id, e.target.value)}
                className="w-full select-bg-arrow cursor-pointer"
                style={{
                  padding: "13px 14px", border: "1.5px solid #e0dcd6", borderRadius: 10,
                  fontSize: 14.5, color: "#1a1a2e", background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)", appearance: "none",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#1a3d7a"
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(19,46,94,0.15), 0 1px 3px rgba(0,0,0,0.06)"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e0dcd6"
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"
                }}
              >
                <option value="">请选择{f.name}</option>
                {f.options?.map((o) => (
                  <option key={o.id} value={o.option_name}>
                    {o.option_name}
                  </option>
                ))}
              </select>
            )}

            {/* Select - multi */}
            {f.type === "select" && f.allow_multiple && (
              <div className="relative" style={{ zIndex: openMultiSelect === f.id ? 200 : 1 }}>
                <div
                  className={`flex flex-wrap items-center gap-1.5 w-full cursor-pointer transition-all duration-200 ${openMultiSelect === f.id ? "open" : ""}`}
                  style={{
                    padding: "12px 14px", minHeight: 46,
                    border: `1.5px solid ${openMultiSelect === f.id ? "#1a3d7a" : "#e0dcd6"}`,
                    borderRadius: 10, background: "#fff",
                    boxShadow: openMultiSelect === f.id
                      ? "0 0 0 3px rgba(19,46,94,0.15), 0 1px 3px rgba(0,0,0,0.06)"
                      : "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                  onClick={() => toggleDropdown(f.id)}
                >
                  {getMultiVal(f.id).length === 0 && (
                    <span style={{ color: "#aca8a0", fontSize: 14 }}>请选择{f.name}</span>
                  )}
                  {getMultiVal(f.id).map((optName) => (
                    <span
                      key={optName}
                      className="public-chip-in inline-flex items-center gap-1"
                      style={{
                        padding: "3px 10px", background: "#e8e4f0", color: "#0a1f3f",
                        borderRadius: 20, fontSize: 12.5, fontWeight: 500,
                      }}
                    >
                      {optName}
                      <span
                        className="inline-flex items-center justify-center cursor-pointer transition-all"
                        style={{
                          width: 14, height: 14, borderRadius: "50%",
                          background: "rgba(0,0,0,0.12)", fontSize: 10, lineHeight: 1,
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMultiOption(f.id, optName)
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(200,0,0,0.2)"
                          e.currentTarget.style.color = "#c00"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(0,0,0,0.12)"
                          e.currentTarget.style.color = "inherit"
                        }}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                  <span className="ml-auto shrink-0 flex items-center justify-center transition-transform duration-200"
                    style={{
                      width: 20, height: 20,
                      transform: openMultiSelect === f.id ? "rotate(180deg)" : "none",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12"><path fill="#999" d="M6 9L1 4h10z" /></svg>
                  </span>
                </div>

                {/* Dropdown */}
                {openMultiSelect === f.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                    <div
                      className="absolute z-20 w-full"
                      style={{
                        top: "calc(100% + 4px)", background: "#fff",
                        border: "1.5px solid #1a3d7a", borderRadius: 10,
                        maxHeight: 240, overflowY: "auto",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      }}
                    >
                      {f.options?.map((o) => (
                        <label
                          key={o.id}
                          className="flex items-center gap-2.5 cursor-pointer transition-all text-sm"
                          style={{
                            padding: "11px 14px", borderBottom: "1px solid #edebe7",
                            fontSize: 13.5,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f0eef5" }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
                        >
                          <input
                            type="checkbox"
                            checked={getMultiVal(f.id).includes(o.option_name)}
                            onChange={() => toggleMultiOption(f.id, o.option_name)}
                            className="shrink-0 cursor-pointer"
                            style={{ width: 17, height: 17, accentColor: "#c9a84c" }}
                          />
                          {o.option_name}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Input */}
            {f.type === "input" && (
              <input
                type={f.id === 35 || f.id === 51 ? "text" : "number"}
                readOnly={f.id === 35}
                value={f.id === 35 ? autoPeriod || "" : getVal(f.id)}
                onChange={(e) => {
                  if (f.id !== 35) setVal(f.id, e.target.value)
                }}
                placeholder={f.id === 35 ? "自动计算" : "请输入" + f.name}
                className="w-full"
                style={{
                  padding: "13px 14px", border: "1.5px solid #e0dcd6", borderRadius: 10,
                  fontSize: 14.5, color: f.id === 35 ? "#7a7a7a" : "#1a1a2e",
                  background: f.id === 35 ? "#f4f3f0" : "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)", fontFamily: "inherit",
                  outline: "none",
                }}
                onFocus={(e) => {
                  if (f.id !== 35) {
                    e.currentTarget.style.borderColor = "#1a3d7a"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(19,46,94,0.15), 0 1px 3px rgba(0,0,0,0.06)"
                  }
                }}
                onBlur={(e) => {
                  if (f.id !== 35) {
                    e.currentTarget.style.borderColor = "#e0dcd6"
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"
                  }
                }}
              />
            )}

            {f.remark && (
              <div className="text-xs mt-1" style={{ color: "#dc2626", lineHeight: 1.5 }}>
                {f.remark}
              </div>
            )}
          </div>
        ))}

{/* ===== Price Summary ===== */}
        <div
          className="mb-4 text-white"
          style={{
            background: "linear-gradient(135deg, #0a1f3f, #132e5e)",
            borderRadius: 14, padding: "20px 20px 8px",
            boxShadow: "0 6px 24px rgba(19,46,94,0.3)",
          }}
        >
          <div className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            <span className="text-xs opacity-85">回收比例</span>
            <span className="font-bold" style={{ fontSize: 15 }}>{ratio !== String(cfg.initial_ratio.toFixed(2)) ? ratio : "自动计算"}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-xs opacity-85">预估租金（元）</span>
            <span className="font-bold" style={{ fontSize: 22, color: "#d4af37" }}>{rental !== "--" ? rental : "自动计算"}</span>
          </div>
          <div
            className="text-center"
            style={{ marginTop: 2, fontSize: 13, color: "#dc2626", lineHeight: 1.5 }}
          >
            此预估租金为纯币价格，不含头、甲及 AW 子弹
          </div>
        </div>

        {/* ===== Submit Button ===== */}
        <button
          onClick={copyToClipboard}
          className="w-full flex items-center justify-center gap-2 font-bold tracking-wide border-none cursor-pointer transition-all duration-200"
          style={{
            padding: 15,
            background: "linear-gradient(135deg, #0f2b2b, #1a3d3d, #2a5a4a)",
            color: "#d4af37", borderRadius: 10, fontSize: 15.5, letterSpacing: 0.5,
            border: "1px solid rgba(212,175,55,0.3)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,168,76,0.4)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,168,76,0.3)"
          }}
        >
          📋 复制估价信息
        </button>

        {/* ===== Hidden textarea for copy ===== */}
        <textarea ref={textareaRef} className="fixed opacity-0 pointer-events-none" style={{ display: "none" }} readOnly />
      </div>

      {/* ===== Floating QR Code ===== */}
      {cfg.qrcode_url && (
        <div
          className="fixed flex flex-col items-center gap-1.5 z-50"
          style={{ right: 12, top: "50%", transform: "translateY(-50%)" }}
        >
          <img
            src={cfg.qrcode_url}
            alt="上架群"
            className="cursor-pointer object-cover bg-white"
            style={{
              width: 52, height: 52, borderRadius: 10,
              border: "2px solid #132e5e",
              boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
            }}
            onClick={() => openModal("qrcode")}
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none" }}
          />
          <span
            className="text-center font-semibold text-2xs"
            style={{
              color: "#0a1f3f", background: "rgba(255,255,255,0.9)",
              padding: "2px 6px", borderRadius: 4, fontSize: 10,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            上架群
          </span>
        </div>
      )}

      {/* ===== Modals ===== */}
      {/* QR Code Modal */}
      {activeModal === "qrcode" && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={closeModal}
        >
          <div
            className="public-modal-in bg-white w-full overflow-y-auto"
            style={{ maxWidth: 320, borderRadius: 14, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex justify-between items-center sticky top-0 z-10 text-white"
              style={{
            background: "linear-gradient(135deg, #0f2b2b, #1a3d3d, #2a5a4a)",
                padding: "20px 22px", borderRadius: "14px 14px 0 0",
              }}
            >
              <h2 className="text-lg m-0">上架群二维码</h2>
              <button
                onClick={closeModal}
                className="flex items-center justify-center border-none text-white cursor-pointer transition-all rounded-full"
                style={{
                  background: "rgba(255,255,255,0.2)", width: 32, height: 32, fontSize: 20, lineHeight: 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.35)"; e.currentTarget.style.transform = "rotate(90deg)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "none" }}
              >
                &times;
              </button>
            </div>
            <div className="p-5 text-sm" style={{ color: "#333", lineHeight: 1.8 }}>
              <img
                src={cfg.qrcode_url}
                alt="上架群二维码"
                className="max-w-full"
                style={{ borderRadius: 8 }}
              />
              <p className="mt-2.5 text-xs" style={{ color: "#666" }}>扫码加入上架群</p>
              <button
                onClick={closeModal}
                className="w-full mt-2.5 py-3 border-none text-white font-semibold cursor-pointer transition-all"
                style={{
            background: "linear-gradient(135deg, #0f2b2b, #1a3d3d, #2a5a4a)",
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {activeModal === "notice" && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={closeModal}
        >
          <div
            className="public-modal-in bg-white w-full overflow-y-auto"
            style={{ maxWidth: 480, borderRadius: 14, maxHeight: "85vh", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex justify-between items-center sticky top-0 z-10 text-white"
              style={{
            background: "linear-gradient(135deg, #0f2b2b, #1a3d3d, #2a5a4a)",
                padding: "20px 22px", borderRadius: "14px 14px 0 0",
              }}
            >
              <h2 className="text-lg m-0">上架须知</h2>
              <button
                onClick={closeModal}
                className="flex items-center justify-center border-none text-white cursor-pointer transition-all rounded-full"
                style={{
                  background: "rgba(255,255,255,0.2)", width: 32, height: 32, fontSize: 20, lineHeight: 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.35)"; e.currentTarget.style.transform = "rotate(90deg)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "none" }}
              >
                &times;
              </button>
            </div>
            <div className="p-5 text-sm leading-relaxed" style={{ color: "#333", lineHeight: 1.8 }}>
              <div dangerouslySetInnerHTML={{ __html: cfg.listing_notice }} />
            </div>
          </div>
        </div>
      )}

      {/* About Us Modal */}
      {activeModal === "aboutus" && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={closeModal}
        >
          <div
            className="public-modal-in bg-white w-full overflow-y-auto"
            style={{ maxWidth: 480, borderRadius: 14, maxHeight: "85vh", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex justify-between items-center sticky top-0 z-10 text-white"
              style={{
            background: "linear-gradient(135deg, #0f2b2b, #1a3d3d, #2a5a4a)",
                padding: "20px 22px", borderRadius: "14px 14px 0 0",
              }}
            >
              <h2 className="text-lg m-0">关于我们</h2>
              <button
                onClick={closeModal}
                className="flex items-center justify-center border-none text-white cursor-pointer transition-all rounded-full"
                style={{
                  background: "rgba(255,255,255,0.2)", width: 32, height: 32, fontSize: 20, lineHeight: 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.35)"; e.currentTarget.style.transform = "rotate(90deg)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "none" }}
              >
                &times;
              </button>
            </div>
            <div className="p-5 text-sm leading-relaxed" style={{ color: "#333", lineHeight: 1.8 }}>
              <div dangerouslySetInnerHTML={{ __html: cfg.about_us }} />
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Overlay */}
      {activeModal === "preview" && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center cursor-pointer"
          style={{ background: "rgba(0,0,0,0.88)" }}
          onClick={closeModal}
        >
          <img
            src={previewUrl}
            alt="preview"
            className="max-w-[95%] max-h-[95vh]"
            style={{ borderRadius: 8 }}
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none" }}
          />
        </div>
      )}

      {/* ===== Footer ===== */}
      <div className="mt-8 pt-6 pb-4 text-center" style={{ borderTop: "1px solid #e8e4de" }}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/images/logo.png" alt="北辰商行" className="size-12 rounded-lg object-cover" style={{ border: "1px solid rgba(0,0,0,0.06)" }} />
          <div className="text-left">
            <div className="font-bold tracking-wider" style={{ fontSize: 16, color: "#4a4a4a", letterSpacing: 1.5 }}>北辰商行</div>
            <div className="text-xs tracking-widest" style={{ color: "#b0b0b0" }}>BEI CHENG SHANG HANG</div>
          </div>
        </div>
        <p className="text-xs mt-3" style={{ color: "#c0c0c0", letterSpacing: 1 }}>
          真实可靠 · 诚信经营 · 安全交易
        </p>
      </div>    </>
  )
}
