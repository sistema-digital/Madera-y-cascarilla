# MADERA y Cascarilla — Horómetros sin correo ni contraseña

## ¿Qué cambió?
- Se quitó por completo el formulario de correo, contraseña, botón Ingresar y botón Cerrar sesión.
- Al abrir Horómetros, la aplicación solicita automáticamente una sesión **anónima** de Supabase; no se introducen credenciales.
- El historial sigue almacenado en la tabla independiente `horometros_lecturas` de Supabase y es compartido entre dispositivos.
- La pantalla conserva cálculos, consultas, totales y validaciones anteriores.
- La primera lectura crea una línea base. La siguiente resta los valores precisos y calcula proporcionalmente 15 tn / 1,5 h y 20 gal / 1,5 h.
- Solo los dispositivos habilitados como `admin` pueden corregir lecturas; las correcciones requieren motivo y generan auditoría.

## Pasos de instalación
1. Abre **el proyecto Supabase que usa el HTML**, cuyo dominio termina en `gqljlhqrufejwxjojqia.supabase.co`.
2. En **Authentication > Providers > Anonymous Sign-Ins**, habilita **Allow anonymous sign-ins**. Consulta: https://supabase.com/docs/guides/auth/auth-anonymous
3. Abre el SQL Editor y ejecuta **uno** de los scripts siguientes:
   - **Si nunca instalaste el módulo de horómetros:** `instalar_horometros_madera.sql` (crea tablas y políticas).
   - **Si ya ejecutaste el script anterior del módulo:** `actualizar_horometros_sin_correo.sql` (actualiza políticas y el trigger; conserva registros).
4. Publica `index.html` y la versión nueva de `sw.js`. Si tu `sw.js` actual tiene funciones adicionales, integra la versión de caché y el manejo de navegación, en vez de reemplazarlo sin revisarlo.
5. Actualiza la PWA y abre Horómetros. La conexión se efectúa automáticamente.

## Administradores sin correo ni contraseña
Cada navegador obtiene un ID técnico de Supabase distinto. En Horómetros abre **ID de dispositivo (para permisos de administrador)**, copia el ID y ejecuta con ese UUID:

```sql
insert into public.horometros_autorizados(user_id, rol)
values ('UUID_REAL_DEL_DISPOSITIVO', 'admin')
on conflict(user_id) do update set rol = excluded.rol;
```

Recarga Horómetros. Ese dispositivo podrá corregir y auditar lecturas. Los dispositivos sin permiso especial son **operadores**: pueden consultar y agregar lecturas, pero no modificar registros existentes. Si un dispositivo borra su almacenamiento local o usa navegación privada, pierde la identidad automática anterior y recibe una nueva al abrir la app.

## Advertencia importante de seguridad
Eliminar las credenciales implica que **cualquier persona con acceso a la aplicación publicada puede consultar y agregar lecturas de horómetros** usando una sesión anónima. Los cambios de lecturas existentes permanecen reservados a dispositivos con rol `admin`. El control por rol limita las correcciones, **pero no limita el acceso de lectura/captura**. Si la información es confidencial, restringe la aplicación a una red interna/VPN o añade un mecanismo alternativo de acceso; no expongas públicamente una aplicación con datos privados.

Supabase recomienda incorporar controles contra abuso (por ejemplo CAPTCHA y límites de velocidad) al habilitar cuentas anónimas. **No uses nunca la clave `service_role` en el navegador**.

## Validación
En el navegador se probó con Supabase simulado el acceso automático, guardado, consulta y corrección por administrador. Para horómetros 4564.3 → 4632.9 los valores son 68.6 h, 686.00 tn y 914.67 gal. No se pudieron realizar escrituras reales ni aplicar el SQL en el proyecto `gqljlhqrufejwxjojqia`, porque no está habilitado en las conexiones administrativas disponibles en esta sesión.

El resto de Madera y Cascarilla (viajes, reportes, toneladas reales, cargas) permanece independiente.
