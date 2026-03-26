import { Link } from 'react-router-dom';
import { type Driver, getNationalityFlag } from '../../data/api';
import { getDriverImage } from '../../data/driverImages';
import TiltCard from '../ui/TiltCard';

interface Props {
  driver: Driver;
  index?: number;
}

export default function DriverCard({ driver, index = 0 }: Props) {
  const flag = getNationalityFlag(driver.nationality);
  const image = getDriverImage(driver.id);

  return (
    <TiltCard>
      <Link
        to={`/driver/${driver.id}`}
        className="bg-c-30 group hover:border-c-10/40 border border-transparent transition-all cursor-pointer block hover-glow relative overflow-hidden"
        role="article"
        aria-label={`${driver.firstName} ${driver.lastName} — P${driver.standingPosition}`}
        style={{ borderBottom: `4px solid ${driver.teamColor}` }}
      >
        {/* Photo header — grayscale to color on hover */}
        <div className="h-48 overflow-hidden relative">
          <img
            src={image}
            alt={`${driver.firstName} ${driver.lastName}`}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-c-30 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <span
              className="font-headline font-black italic text-4xl opacity-90"
              style={{ color: driver.teamColor }}
            >
              P{driver.standingPosition}
            </span>
          </div>
          <span
            className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 tracking-widest"
            style={{ backgroundColor: driver.teamColor + '25', color: driver.teamColor }}
          >
            #{driver.number}
          </span>
        </div>

        {/* Driver info */}
        <div className="p-6 pt-3">
          {/* Team */}
          <p className="text-[10px] text-t-main/50 font-label uppercase tracking-widest mb-1">
            {driver.team}
          </p>

          {/* Name */}
          <h3 className="font-headline font-bold italic text-xl text-t-bright uppercase mb-4">
            {driver.firstName}{' '}
            <span className="group-hover:text-c-10 transition-colors">{driver.lastName}</span>
          </h3>

          {/* Stats row */}
          <div className="flex items-center justify-between border-t border-t-main/10 pt-4">
            <div className="flex flex-col">
              <span className="font-headline font-bold italic uppercase text-[0.6rem] text-t-main/50">
                Points
              </span>
              <span className="font-headline font-bold text-2xl" style={{ color: driver.teamColor }}>
                {driver.seasonPoints}
              </span>
            </div>
            {driver.seasonWins > 0 && (
              <div className="flex flex-col items-center">
                <span className="font-headline font-bold italic uppercase text-[0.6rem] text-t-main/50">
                  Wins
                </span>
                <span className="font-headline font-bold text-2xl text-t-bright">
                  {driver.seasonWins}
                </span>
              </div>
            )}
            <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
              {flag}
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
