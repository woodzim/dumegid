'use client';
import styled from '@emotion/styled';

export const EmotionBadge = styled.span<{ variant?: 'primary' | 'secondary' | 'accent' | 'neutral' }>`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: 'Creato Display', sans-serif;
    font-size: 12px;
    font-weight: 600;

    background-color: ${(props) =>
        props.variant === 'accent'
            ? '#166534'
            : props.variant === 'secondary'
              ? '#334155'
              : props.variant === 'primary'
                ? '#303e6f'
                : '#1e293b'};

    color: ${(props) =>
        props.variant === 'accent'
            ? '#86efac'
            : props.variant === 'secondary'
              ? '#cbd5e1'
              : props.variant === 'primary'
                ? '#e6e8ee'
                : '#cbd5e1'};
`;
