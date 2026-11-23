'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CONTACT_FLOW, PROJECTS, SERVICES, SITE } from '../data/content';

type Mode = 'start' | 'project' | 'message' | 'done';
type Flow = 'project' | 'message';

/**
 * The reference's step-by-step contact screen. No backend: the last step opens the
 * visitor's mail app with every answer filled in (mailto), nothing is stored.
 */
export default function ContactFlow() {
    // ?layanan=<service id> or ?proyek=<project slug> from the "Pelajari" / case-study buttons
    const params = useSearchParams();
    const presetNote = useMemo(() => {
        const svc = SERVICES.find((s) => s.id === params.get('layanan'));
        const prj = PROJECTS.find((p) => p.slug === params.get('proyek'));
        return svc ? svc.title : prj ? `Proyek seperti ${prj.name}` : '';
    }, [params]);

    const [mode, setMode] = useState<Mode>('start');
    const [flow, setFlow] = useState<Flow>('project');
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>(presetNote ? { service: presetNote } : {});
    const [copied, setCopied] = useState(false);

    const steps = mode === 'project' || mode === 'message' ? CONTACT_FLOW.steps[mode] : [];
    const current = steps[step];
    const value = current ? (answers[current.key] ?? '') : '';
    const valid = current ? value.trim().length > 0 && (current.type !== 'email' || /\S+@\S+\.\S+/.test(value)) : false;

    const choose = async (id: string) => {
        if (id === 'copy') {
            try {
                await navigator.clipboard.writeText(SITE.email);
                setCopied(true);
                setTimeout(() => setCopied(false), 2200);
            } catch {
                window.location.assign(`mailto:${SITE.email}`); // clipboard blocked: open the mail app instead
            }
            return;
        }
        setMode(id as Flow);
        setFlow(id as Flow);
        setStep(0);
    };

    const next = () => {
        if (!valid) return;
        if (step < steps.length - 1) setStep(step + 1);
        else setMode('done');
    };
    const back = () => {
        if (step > 0) setStep(step - 1);
        else setMode('start');
    };

    const mailto = () => {
        const subject = flow === 'project' ? `Proyek baru: ${answers.company ?? answers.name ?? ''}` : `Pesan dari ${answers.name ?? 'situs DUMEG'}`;
        const body = CONTACT_FLOW.steps[flow].map((s) => `${s.q}\n${answers[s.key] ?? '-'}`).join('\n\n');
        return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const fade = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -14 }, transition: { duration: 0.35 } };

    return (
        <div className="relative z-10 flex w-full flex-col items-center text-center">
            <AnimatePresence mode="wait">
                {mode === 'start' && (
                    <motion.div key="start" {...fade} className="flex flex-col items-center">
                        <p className="text-[20px] leading-[0.95] tracking-tight text-ink md:text-[36px]">{CONTACT_FLOW.question}</p>
                        {presetNote && <p className="mt-3 text-[14px] text-muted">( {presetNote} )</p>}
                        <div className="mt-6 flex flex-wrap justify-center gap-3 lg:flex-nowrap">
                            {CONTACT_FLOW.choices.map((c) => (
                                <button key={c.id} type="button" onClick={() => choose(c.id)} className="btn-mono">
                                    {c.id === 'copy' && copied ? 'Email tersalin' : c.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {current && (mode === 'project' || mode === 'message') && (
                    <motion.form
                        key={`${mode}-${step}`}
                        {...fade}
                        className="flex w-full flex-col items-center"
                        onSubmit={(e) => {
                            e.preventDefault();
                            next();
                        }}
                    >
                        <label htmlFor="cf-input" className="text-[20px] leading-[0.95] tracking-tight text-ink md:text-[36px]">
                            {current.q}
                        </label>
                        <input
                            id="cf-input"
                            autoFocus
                            type={current.type ?? 'text'}
                            value={value}
                            placeholder={current.placeholder}
                            onChange={(e) => setAnswers((a) => ({ ...a, [current.key]: e.target.value }))}
                            className="mt-6 w-[min(420px,85%)] border-b border-rule bg-transparent pb-2 text-center text-[18px] tracking-tight outline-none placeholder:text-faint focus:border-ink"
                        />
                    </motion.form>
                )}

                {mode === 'done' && (
                    <motion.div key="done" {...fade} className="flex flex-col items-center">
                        <p className="text-[20px] leading-[0.95] tracking-tight text-ink md:text-[36px]">Terima kasih, {answers.name}.</p>
                        <p className="mt-4 max-w-[460px] text-[16px] leading-6 tracking-tight text-muted">
                            Jawabanmu sudah kami rangkai menjadi email. Kirim dari aplikasi emailmu, tim DUMEG akan membalas ke {answers.email}.
                        </p>
                        <a href={mailto()} className="btn-mono mt-6">
                            Buka email & kirim <span aria-hidden="true">→</span>
                        </a>
                        <button type="button" onClick={() => setMode('start')} className="mt-4 font-mono text-[12px] uppercase tracking-tight text-muted underline-offset-2 hover:underline">
                            Mulai lagi
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {current && (mode === 'project' || mode === 'message') && (
                <div className="fixed bottom-[clamp(24px,6vh,60px)] left-1/2 z-30 flex -translate-x-1/2 gap-2">
                    <button type="button" onClick={back} className="btn-mono">
                        Kembali
                    </button>
                    <span className="btn-mono !bg-paper-2 !text-ink">
                        {step + 1} / {steps.length}
                    </span>
                    <button type="button" onClick={next} disabled={!valid} className="btn-mono disabled:!bg-paper-2 disabled:!text-faint">
                        Lanjut
                    </button>
                </div>
            )}
        </div>
    );
}
