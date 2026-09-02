import { inject, Service, signal } from '@angular/core';
import { AuthError, createClient } from '@supabase/supabase-js'
import { Keys } from '../shared/services/key';
import { AbstractControl } from '@angular/forms';
import { LocalStorage } from './local-storage';
import { Supabase } from './db';

@Service()
export class Auth {
  private key = inject(Keys)
  private local = inject(LocalStorage)
  private db = inject(Supabase).db

  isActiveSession = signal(false);
  token = this.local.getItem(this.key.token);
  tokenExpiryTime = signal(0);
  currentTimestamp: number = Math.floor(Date.now() / 1000);
  errorMessage = signal('')

  /**
   * Calls {@link signInWithPassword} function from supabase to validate users typed credentials
   * Sets either an error or activeSession state according to the thrown error
   * @param email - the users email input
   * @param password - the users password input
   */
  async signInWithEmail(email: AbstractControl<string | null, string | null, any> | null, password: AbstractControl<string | null, string | null, any> | null) {
    const { data, error } = await this.db.auth.signInWithPassword({
      email: email?.value ?? '',
      password: password?.value ?? '',
    })
    error ? this.updateErrorMessage(error) : this.updateActiveSession(data.session?.access_token)
  }

  /**
   * updates the errorMessage signal, to display the proper Error
   * @param error - the thrown Error from the backend
   */
  updateErrorMessage(error: AuthError): void {
    this.errorMessage.set("")
    this.errorMessage.update(() => this.returnErrorMessage(error))
  }

  /**
   * It returns the proper Error Message, depending on @param error
   * @param error - the thrown Error from the backend
   * @returns 
   */
  returnErrorMessage(error: AuthError): string {
    type ErrorMessages = 
    "E-Mail, oder Passwort falsch" | 
    "Bitte eine E-Mail eingeben" | 
    "Der Benutzer ist gesperrt" | 
    "Ein unbekannter Fehler ist aufgetreten";
    
    const errorMessage: Record<string, ErrorMessages> = {
      invalid_credentials: "E-Mail, oder Passwort falsch",
      validation_failed: "Bitte eine E-Mail eingeben",
      user_banned: "Der Benutzer ist gesperrt"
    }
    return errorMessage[error.code ?? ""] ?? "Ein unbekannter Fehler ist aufgetreten"
  }

  /**
   * Updates the ActiveSession Signal either to true or false
   * @param token - the access token as string
   * @returns - true or false, depending if {@link signInWithEmail} was successful, or not
   */
  updateActiveSession(token: string | undefined): boolean {
    if (token) {
      this.isActiveSession.update(() => true)
      return true
    } else {
      this.isActiveSession.update(() => false)
      return false
    }
  }

  /**
   * Reads the local storage acces token, if it exists.
   * Sets activeSession Signal according to token expiry state
   * @returns 
   */
  readAccesToken(): boolean {
    if (!this.local.token) {
      return false
    }
    else {
      this.local.json = this.local.parseJSON(this.token);
      this.tokenExpiryTime.update(() => this.local.json.expires_at);
      if (this.isTokenExpired()) {
        this.removeActiveSession()
        return false
      } else {
        this.isActiveSession.update(() => true)
        return true
      }
    }
  }

  /**
   * Check wether the token has expired
   * @returns - true, when current timestamp past token expiry time
   */
  isTokenExpired(): boolean {
    return (this.currentTimestamp - this.tokenExpiryTime()) > 0
  }


  /**
   * removes related Session Storages and signals
   */
  removeActiveSession() {
    this.local.deleteLocalStorage(this.key.token);
    this.isActiveSession.update(() => false);
  }
}


