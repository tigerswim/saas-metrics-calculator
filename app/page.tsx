import Calculator from './components/Calculator';
import { IndustryProvider } from './contexts/IndustryContext';

export default function Home() {
  return (
    <IndustryProvider initialIndustry="insurance">
      <Calculator />
    </IndustryProvider>
  );
}
