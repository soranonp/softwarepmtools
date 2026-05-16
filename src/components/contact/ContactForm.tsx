"use client";

import { useState } from "react";
import { SITE } from "@/src/lib/content";
import { Card } from "@/src/components/ui/Card";
import { Button, ButtonLink } from "@/src/components/ui/Button";

const labelClass = "block text-sm font-semibold text-navy-900";
const controlClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-navy-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend in this version — direct the lead to the Google Form.
    setSubmitted(true);
  }

  return (
    <Card>
      {submitted ? (
        <div className="py-6 text-center">
          <p className="text-lg font-bold text-navy-900">
            ขอบคุณสำหรับความสนใจ
          </p>
          <p className="mt-2 text-sm leading-7 text-muted">
            เวอร์ชันนี้ยังไม่รองรับการส่งข้อมูลผ่านเว็บโดยตรง
            กรุณากรอกรายละเอียดผ่านแบบฟอร์ม Google Form
            เพื่อให้ทีมติดต่อกลับโดยเร็วที่สุด
          </p>
          <div className="mt-6 flex justify-center">
            <ButtonLink
              href={SITE.googleFormUrl}
              external
              size="lg"
            >
              เปิดแบบฟอร์มติดต่อ
            </ButtonLink>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="name">
                ชื่อ-นามสกุล
              </label>
              <input
                id="name"
                name="name"
                required
                className={controlClass}
                placeholder="ชื่อของคุณ"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="company">
                บริษัท / องค์กร
              </label>
              <input
                id="company"
                name="company"
                className={controlClass}
                placeholder="ชื่อบริษัท (ถ้ามี)"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="email">
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={controlClass}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">
                เบอร์ติดต่อ
              </label>
              <input
                id="phone"
                name="phone"
                className={controlClass}
                placeholder="08x-xxx-xxxx"
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="topic">
              สนใจบริการ
            </label>
            <select id="topic" name="topic" className={controlClass}>
              <option>Quick Estimate Review</option>
              <option>SOW Ready Pack</option>
              <option>Vendor Proposal Review</option>
              <option>PM-as-a-Service</option>
              <option>อื่น ๆ / ยังไม่แน่ใจ</option>
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="message">
              รายละเอียดโปรเจกต์
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className={controlClass}
              placeholder="เล่าคร่าว ๆ เกี่ยวกับโปรเจกต์ ขอบเขต และสิ่งที่ต้องการ"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            ส่งข้อมูล
          </Button>
          <p className="text-center text-xs text-faint">
            เวอร์ชันนี้ยังไม่มีระบบรับข้อมูลฝั่งเซิร์ฟเวอร์
            หลังกดส่งจะนำทางไปยังแบบฟอร์ม Google Form
          </p>
        </form>
      )}
    </Card>
  );
}
