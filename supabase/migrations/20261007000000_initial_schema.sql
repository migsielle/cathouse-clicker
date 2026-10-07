CREATE TABLE public.house_clicks (
  house text PRIMARY KEY,
  clicks bigint NOT NULL DEFAULT 0
);

GRANT SELECT ON public.house_clicks TO anon, authenticated;
GRANT ALL ON public.house_clicks TO service_role;

ALTER TABLE public.house_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scores"
  ON public.house_clicks
  FOR SELECT
  USING (true);

INSERT INTO public.house_clicks (house)
VALUES ('white'), ('black'), ('orange'), ('calico');

CREATE OR REPLACE FUNCTION public.add_clicks(_house text, _n int)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result bigint;
BEGIN
  IF _n < 1 OR _n > 200 THEN
    RAISE EXCEPTION 'invalid click count';
  END IF;

  UPDATE public.house_clicks
  SET clicks = clicks + _n
  WHERE house = _house
  RETURNING clicks INTO result;

  IF result IS NULL THEN
    RAISE EXCEPTION 'invalid house';
  END IF;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.add_clicks(text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_clicks(text, int) TO anon, authenticated;
