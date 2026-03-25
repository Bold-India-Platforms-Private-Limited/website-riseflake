import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';

const Header = styled.div`
  display: flex;
  align-items: center;

  /* background strip */
  background: #f1f5ec;

  /* ❗ height ko image control karegi */
  padding-right: 32px;
  gap: 28px;

  /* thoda neeche shift */
  margin-top: 20px;
`;

const Photo = styled.div`
  width: 160px; /* 🔼 image bigger */
  height: 160px; /* 🔼 image bigger */
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertically center text */
  gap: 6px;
`;

const Name = styled.h1`
  font-size: 36px;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
`;

const Role = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #374151;
`;

const Meta = styled.div`
  margin-top: 10px;
  font-size: 13px;
  color: #111827;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  return (
    <Header>
      {basics.image && (
        <Photo>
          <img src={basics.image} alt={basics.name} />
        </Photo>
      )}

      <Info>
        <Name>{basics.name}</Name>
        {basics.label && <Role>{basics.label}</Role>}

        <Meta>
          {basics.phone && <span>{basics.phone}</span>}
          {basics.profiles?.[0]?.url && (
            <span>{basics.profiles[0].url.replace(/^https?:\/\//, '')}</span>
          )}
        </Meta>
      </Info>
    </Header>
  );
}
