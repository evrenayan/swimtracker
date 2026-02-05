"use client";

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getSwimmerBarriers, getAllSwimmingStyles, getAllBarrierValues } from '@/lib/supabase/queries';
import { formatTime } from '@/lib/utils/timeFormat';

const BARRIER_NAMES = ['B1', 'B2', 'A1', 'A2', 'A3', 'A4'];

export default function BarrierGraphPage() {
  const [age, setAge] = useState<number>(12);
  const [swimmingStyles, setSwimmingStyles] = useState<any[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [female, setFemale] = useState<any[]>([]);
  const [male, setMale] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const stylesRes = await getAllSwimmingStyles();
        const styles = stylesRes.data || [];
        setSwimmingStyles(styles);
        if (styles.length > 0) setSelectedStyleId(styles[0].id);
      } catch (err) {
        setSwimmingStyles([]);
      }
    })();
  }, []);

  const loadData = async (selectedAge: number, styleId: string | null) => {
    setLoading(true);
    try {
      const [fRes, mRes] = await Promise.all([
        getSwimmerBarriers(selectedAge, 'Kadın'),
        getSwimmerBarriers(selectedAge, 'Erkek'),
      ]);
      let fAll = fRes.data || [];
      let mAll = mRes.data || [];

      // Helper to match style by possible fields
      const matchesStyle = (row: any) => {
        if (!styleId) return true;
        if (row.swimming_style_id && String(row.swimming_style_id) === String(styleId)) return true;
        if (row.swimming_styles && row.swimming_styles.id && String(row.swimming_styles.id) === String(styleId)) return true;
        if (row.swimming_styles && row.swimming_styles.name) return String(row.swimming_styles.name) === String(swimmingStyles.find(s => s.id === styleId)?.name);
        return false;
      };

      // If male or female arrays are empty, fallback to fetching all barrier values and filter
      if ((!fAll || fAll.length === 0) || (!mAll || mAll.length === 0)) {
        try {
          const allRes = await getAllBarrierValues();
          const all = allRes.data || [];
          if (!fAll || fAll.length === 0) fAll = all.filter((r: any) => Number(r.age) === Number(selectedAge) && String(r.gender).toLowerCase() === 'kadın');
          if (!mAll || mAll.length === 0) mAll = all.filter((r: any) => Number(r.age) === Number(selectedAge) && String(r.gender).toLowerCase() === 'erkek');
        } catch (err) {
          // keep existing arrays
        }
      }

      const fFiltered = fAll.filter(matchesStyle);
      const mFiltered = mAll.filter(matchesStyle);

      setFemale(fFiltered);
      setMale(mFiltered);
    } catch (err) {
      setFemale([]);
      setMale([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStyleId) loadData(age, selectedStyleId);
  }, [age, selectedStyleId]);

  const findValue = (arr: any[], name: string) => {
    return arr.find((r) => r.barrier_types?.name === name);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-3xl font-bold text-pink-900 mb-4">Baraj Grafiği</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Select
              label="Yaş Grubu"
              options={[
                { value: '11', label: '11 yaş' },
                { value: '12', label: '12 yaş' },
              ]}
              value={String(age)}
              onChange={(e) => setAge(Number(e.target.value))}
            />

            <Select
              label="Yüzme Stili"
              options={swimmingStyles.map((s) => ({ value: s.id, label: s.name }))}
              value={selectedStyleId || ''}
              onChange={(e) => setSelectedStyleId(e.target.value || null)}
            />
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="text-left pb-2">Baraj</th>
                      <th className="text-left pb-2">Kadın</th>
                      <th className="text-left pb-2">Erkek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BARRIER_NAMES.map((bn) => {
                      const f = findValue(female, bn);
                      const m = findValue(male, bn);

                      return (
                        <tr key={bn} className="border-t">
                          <td className="py-3 font-medium text-pink-900">{bn}</td>
                          <td className="py-3">{f ? formatTime(f.time_milliseconds) : '-'}</td>
                          <td className="py-3">{m ? formatTime(m.time_milliseconds) : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
