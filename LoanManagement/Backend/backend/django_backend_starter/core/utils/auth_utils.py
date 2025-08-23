from rest_framework_simplejwt.tokens import RefreshToken

def set_refresh_cookie(response, refresh_token):
    """
    Sets refresh token as HttpOnly, Secure, SameSite cookie.
    """
    response.set_cookie(
        key="refresh_token",
        value=str(refresh_token),
        httponly=True,
        secure=False,  # True in production (HTTPS)
        samesite="Lax",
        max_age=7*24*3600  # 7 days
    )
    return response

def rotate_refresh_token(old_refresh):
    """
    Rotate refresh token: issue new one and blacklist old one.
    """
    new_refresh = RefreshToken.for_user(old_refresh.user)
    old_refresh.blacklist()  # Requires simplejwt.token_blacklist app
    return new_refresh
